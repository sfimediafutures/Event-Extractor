import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DropBox from "@/components/DropBox";
import ResultsWindow from "@/components/ResultsWindow";
import Overlay from "@/components/StartOverlay";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DraggableWord from '@/components/DraggableWord';
import ProgressBar from '@/components/ProgressBar';
import { motion, AnimatePresence } from "framer-motion"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';

import doc1 from "@/example_docs/doc_1.json";
import doc2 from "@/example_docs/doc_2.json";
import doc3 from "@/example_docs/doc_3.json";
import doc4 from "@/example_docs/doc_5.json";
import doc5 from "@/example_docs/doc_6.json";

const articleData = [
  { doc: doc1, title: "Satt 37 år i fengsel for en voldtekt han aldri begikk – nå er han storfavoritt i talentprogram" },
  { doc: doc2, title: "Fotballfrue pågrepet med våpen på flyplass" },
  { doc: doc3, title: "Elbilen er forsinket - nå må flere tusen nordmenn vente" },
  { doc: doc4, title: "Mann (72) knivdrept i videomøte" },
  { doc: doc5, title: "Politiet med båtjakt etter knivepisode" }
];

const splitWordsAndPunctuation = (htmlString) => {
  // Create a temporary div to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;
  
  // Get text content while preserving spaces and line breaks
  const paragraphs = tempDiv.getElementsByTagName('p');
  let result = [];
  Array.from(paragraphs).forEach((p, pIndex) => {
    const text = p.textContent || p.innerText;
    const regex = /(\S+)([.,!?;:"""«»]*)(\s*)/g;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      result.push({
        word: match[1],
        punctuation: match[2],
        space: match[3]
      });
    }
    
    // Add a line break after each paragraph except the last one
    if (pIndex < paragraphs.length - 1) {
      result.push({ word: '', punctuation: '', space: '\n\n' });
    }
  });
  
  return result;
};

const fetchArticle = async (topicId) => {
  const selectedArticle = articleData[parseInt(topicId) - 1];
  if (!selectedArticle) return null;
  
  return {
    title: selectedArticle.title,
    content: selectedArticle.doc.body_text,
    instruction: "Finn og dra passende ord eller uttrykk fra teksten til riktig boks.",
    events: selectedArticle.doc.events
  };
};

const fetchTimes = () => {
  const storedTimes = localStorage.getItem("savedTimes");
  return storedTimes ? JSON.parse(storedTimes) : [];
};

const saveTime = ({ time, name, articleTitle }) => {
  const times = fetchTimes();
  const existingIndex = times.findIndex((t) => t.name === name);
  if (existingIndex !== -1) {
    times[existingIndex] = { name, time, articleTitle };
  } else {
    times.push({ name, time, articleTitle });
  }
  localStorage.setItem("savedTimes", JSON.stringify(times));
  return { success: true };
};

const EventList = ({ events, progress }) => {
  if (!events || events.length === 0 || progress === 0) return null; // Only render if progress has started

  const getVisibleEvents = () => {
    const eventsPerStep = events.length / 100;
    return Math.floor(progress * eventsPerStep);
  };

  const visibleEvents = events.slice(0, getVisibleEvents());

  return (
    <div>
      <h2 className="font-bold mb-4 text-lg text-center">Detected Events:</h2>
      <AnimatePresence>
        {visibleEvents.flat().map((event, index) => {
          if (!event) return null;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 p-3 bg-slate-50 rounded"
            >
              <p className="font-semibold text-blue-600">{event.event_type}</p>
              {event.trigger && (
                <p className="text-sm mt-1">
                  <span className="font-medium">Trigger:</span>{' '}
                  {event.trigger} {/* Display full trigger */}
                </p>
              )}
              {event.arguments && event.arguments.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium text-sm">Arguments:</p>
                  <ul className="list-disc pl-5 text-sm">
                    {event.arguments.map((arg, argIndex) => (
                      <li key={argIndex}>
                        <span className="font-medium">{arg[2]}</span>{' '}
                        {arg[0]} {/* Display full argument without colon */}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

const ArticlePage = () => {
  const { topicId } = useParams();
  const [article, setArticle] = useState({ title: '', content: '', instruction: '', events: [] });
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [droppedWords, setDroppedWords] = useState(Array(5).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [progress, setProgress] = useState(0);
  const [modelDone, setModelDone] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const queryClient = useQueryClient();

  const { data: times = [] } = useQuery({
    queryKey: ['times'],
    queryFn: fetchTimes,
  });

  const saveMutation = useMutation({
    mutationFn: saveTime,
    onSuccess: () => {
      queryClient.invalidateQueries(['times']);
    },
  });

  useEffect(() => {
    fetchArticle(topicId).then(setArticle);
  }, [topicId]);

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    let progressInterval;
    if (isTimerRunning && progress < 100) {
      progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(progressInterval);
            setModelDone(true);
            return 100;
          }
          return prevProgress + 1;
        });
      }, 30);
    }
    return () => clearInterval(progressInterval);
  }, [isTimerRunning, progress]);

  const handleStartStop = () => {
    if (isTimerRunning && droppedWords.every(word => word !== null)) {
      setIsTimerRunning(false);
      setShowResults(true);
    } else if (!isTimerRunning) {
      setIsTimerRunning(true);
      setTimer(0);
      setDroppedWords(Array(4).fill(null));
      setProgress(0);
      setModelDone(false);
      setShowOverlay(false);
    }
  };

  const handleDrop = (index, word) => {
    if (!isTimerRunning) return;
    setDroppedWords((prev) => {
      const newDroppedWords = [...prev];
      newDroppedWords[index] = word;
      return newDroppedWords;
    });
  };

  const handleSaveTime = (name) => {
    saveMutation.mutate({ time: timer, name, articleTitle: article.title });
  };

  const allBoxesFilled = droppedWords.every((word) => word !== null);

  return (
    <div className="flex flex-row min-h-screen bg-gray-100 p-6 px-4 gap-4">
      <Card className="w-3/4 mx-auto p-6 select-none">
      <h1 className="flex justify-center text-3xl font-bold -mb-4">{article.title}</h1>
        <div className="flex mb-6">
          <div className="flex-none flex flex-col justify-top gap-4 min-w-36 w-1/4 h-fit bg-slate-300 rounded-lg px-4 py-2 pb-4 mr-8 mt-12">
            <div className="flex justify-between items-center mt-4">
              <div className="text-lg font-semibold">Time: {timer}s</div>
              <Button onClick={handleStartStop} className="bg-slate-500 text-slate-100">
                {isTimerRunning ? "Ferdig" : "Start"}
              </Button>
            </div>
            <p>Finn et event i teksten og dra riktig ord til riktig boks! Klikk på "Ferdig" når du har fylt alle bokser for å stoppe tidtakeren og se resultatene.</p>
            {["Hvem?", "Hvor?", "Når?", "Hva?"].map((label, index) => (
              <DropBox key={index} index={index + 1} onDrop={(word) => handleDrop(index, word)}>
                {droppedWords[index] || label}
              </DropBox>
            ))}
          </div>
          <div className="flex-1">
            {/* <h1 className="flex justify-center text-3xl font-bold -mb-4">{article.title}</h1> */}
            {article.content && article.content.split('\n').map((paragraph, pIndex) => (
              <p key={pIndex} className="mb-4 whitespace-pre-wrap">
                {splitWordsAndPunctuation(`<p>${paragraph}</p>`).map((item, index) => (
                  <React.Fragment key={index}>
                    <DraggableWord
                      word={item.word}
                      disabled={!isTimerRunning}
                    />
                    <span>{item.punctuation}</span>
                    <span>{item.space}</span>
                  </React.Fragment>
                ))}
              </p>
            ))}
          </div>
        </div>
      </Card>
      <Card className="w-1/4 mx-auto p-6 select-none">
        <div className="flex flex-col gap-4">
          <div className="text-lg font-bold pt-2 text-center">
            Automatic event extraction:
          </div>
          <div className="h-fit px-4 py-6 flex flex-row justify-items-start items-start gap-4 rounded-lg bg-slate-100">
            <ProgressBar progress={progress} modelDone={modelDone} />
            <div className="flex flex-col h-96 justify-between pt-2">
              <div className="text-md"><b>Step 4:</b><br/> Finish extraction and saving the output</div>
              <div className="text-md"><b>Step 3:</b><br/> Extracting events from the text</div>
              <div className="text-md"><b>Step 2:</b><br/> Loading the model</div>
              <div className="text-md"><b>Step 1:</b><br/> Pre-processing the text</div>
            </div>
          </div>
          {progress > 70 && (
            <>
              <div className="flex justify-center mt-4">
                <FontAwesomeIcon icon={faArrowDown} className="text-2xl text-gray-600" />
              </div>
              <div>
                <h2 className="font-bold mb-4 text-lg text-center">Detected Events:</h2>
                <AnimatePresence>
                  {article.events && article.events.slice(0, Math.floor(progress * article.events.length / 100)).map((event, index) => {
                    if (!event) return null;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-4 p-3 bg-slate-50 rounded"
                      >
                        <p className="font-semibold text-blue-600">{event.event_type}</p>
                        {event.trigger && (
                          <p className="text-sm mt-1">
                            <span className="font-medium">Trigger:</span>{' '}
                            {event.trigger}
                          </p>
                        )}
                        {event.arguments && event.arguments.length > 0 && (
                          <div className="mt-2">
                            <p className="font-medium text-sm">Arguments:</p>
                            <ul className="list-disc pl-5 text-sm">
                              {event.arguments.map((arg, argIndex) => (
                                <li key={argIndex}>
                                  <span className="font-medium">{arg[0]}:</span> {arg[1]}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </Card>
      {showResults && (
        <ResultsWindow
          time={timer}
          times={times}
          onSave={handleSaveTime}
          currentArticleTitle={article.title}
        />
      )}
      {showOverlay && (
        <Overlay
          instruction={article.instruction}
          onStart={handleStartStop}
          onClose={() => setShowOverlay(false)}
        />
      )}
    </div>
  );
};

export default ArticlePage;