import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DropBox from "@/components/DropBox";
import ResultsWindow from "@/components/ResultsWindow";
import Overlay from "@/components/StartOverlay"; // Import the Overlay component
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DraggableWord from '@/components/DraggableWord';
import ProgressBar from '@/components/ProgressBar';

// Import the example documents
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
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;
  const textContent = tempDiv.innerText;
  const regex = /(\S+)([.,!?;:"""«»\s]*)/g;
  let result = [];
  let match;
  textArray.forEach((item) => {
    let match;
    while ((match = regex.exec(item)) !== null) {
      result.push({ word: match[1], punctuation: match[2].trimStart() + ' ' });
    }
  });
  return result;
};

const fetchArticle = async (topicId) => {
  const article = articleData[topicId - 1]; // Adjusting for 0-based indexing
  const textArray = article.doc.body_text;
  const combinedText = textArray.join("");

  return {
    title: article.title,
    content: combinedText,
    instruction: "Finn og dra passende ord eller uttrykk fra teksten til riktig boks."
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

const ArticlePage = () => {
  const { topicId } = useParams();
  const [article, setArticle] = useState({ title: '', content: '', instruction: '' });
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [droppedWords, setDroppedWords] = useState(Array(5).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [progress, setProgress] = useState(0);
  const [modelDone, setModelDone] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true); // State for overlay visibility
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
      }, 40); // 4000ms / 100 = 40ms per 1% increase
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
      setDroppedWords(Array(5).fill(null));
      setProgress(0);
      setModelDone(false);
      setShowOverlay(false); // Close the overlay when starting
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
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="max-w-full mx-auto p-6 select-none">
        <h1 className="flex justify-center text-3xl font-bold mb-4">{article.title}</h1>
        <div className="flex mb-6"> {/* Flex container for boxes and article text */}
          <div className="flex-none flex flex-col justify-top gap-4 min-w-36 w-1/5 h-fit bg-slate-300 rounded-lg px-4 py-2 pb-4 mr-8"> {/* Box container */}
            <div className="flex justify-between items-center mt-4"> {/* Timer and Stop button area */}
              <div className="text-lg font-semibold">Time: {timer}s</div>
              <Button onClick={handleStartStop} className="bg-slate-500 text-slate-100">
                {isTimerRunning ? "Ferdig" : "Start"}
              </Button>
            </div>
            <p>Finn et event i teksten og dra riktig ord til riktig boks! Klikk på "Ferdig" når du har fylt alle bokser for å stoppe tidtakeren og se resultatene.</p>
              {["Who", "Where", "When", "What", "Why"].map((label, index) => (
                <DropBox key={index} index={index + 1} onDrop={(word) => handleDrop(index, word)}>
                  {droppedWords[index] || label} {/* Show dropped word or label */}
                </DropBox>
              ))}
          </div>
          <div className="flex-1"> {/* Article content area */}
            <div className="flex"> {/* Flex container for article content and progress bar */}
              <div className="flex-1 overflow-y-auto"> {/* Allow scrolling if the content overflows */}
                {splitWordsAndPunctuation(article.content.split(/\r?\n/)).map((item, index) => (
                  <React.Fragment key={index}>
                    <DraggableWord
                      word={item.word}
                      disabled={!isTimerRunning}
                    />
                    <span>{item.punctuation}</span>
                  </React.Fragment>
                ))}
              </div>
              <div className="w-10 ml-6 flex justify-center items-center"> {/* Fixed width for ProgressBar */}
                <ProgressBar progress={progress} modelDone={modelDone} />
              </div>
            </div>
          </div>
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
      {showOverlay && ( // Render Overlay if showOverlay is true
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
