import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DropBox from "@/components/DropBox";
import ResultsWindow from "@/components/ResultsWindow";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DraggableWord from '@/components/DraggableWord';
import ProgressBar from '@/components/ProgressBar';

// Import the example documents
import doc1 from "@/example_docs/example_doc1.json";
import doc2 from "@/example_docs/example_doc2.json";
import doc3 from "@/example_docs/example_doc3.json";
import doc4 from "@/example_docs/example_doc4.json";
import doc5 from "@/example_docs/example_doc5.json";

const articleData = [
  { doc: doc1, title: "Er vi redde for moral?" },
  { doc: doc2, title: "Placeholder" },
  { doc: doc3, title: "Heavyrockens Elvis Presley" },
  { doc: doc4, title: "Innbytterne avgjorde for AaFK!" },
  { doc: doc5, title: "Placeholder nr2" }
];

const splitWordsAndPunctuation = (textArray) => {
  const regex = /(\S+)([.,!?;:"""«»\s]*)/g;
  let result = [];
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
  const textArray = article.doc.doc_text;
  const combinedText = textArray.join("");

  return {
    title: article.title,
    content: combinedText,
    instruction: "Identify the 5 most important words in this article and drag them to the boxes below."
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
      <Card className="max-w-full mx-auto p-6 flex flex-col md:flex-row">
        <div className="flex-1"> {/* Take full width on small screens, flex on medium and larger */}
          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
          <p className="text-lg mb-6">{article.instruction}</p>
          <div className="mb-6 flex items-center">
            <Button onClick={handleStartStop} disabled={isTimerRunning && !allBoxesFilled}>
              {isTimerRunning ? "Stop" : "Start"}
            </Button>
            <span className="ml-4 text-xl">Timer: {timer}s</span>
          </div>
          <div className="mb-8 flex"> {/* Flex container for article content and progress bar */}
            <div className="flex-1 h-full flex"> {/* Article content area */}
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
              <div className="w-1/4 ml-6 flex justify-center items-center"> {/* Fixed width for ProgressBar */}
                <ProgressBar progress={progress} modelDone={modelDone} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-4 mb-8">
            {droppedWords.map((word, index) => (
              <DropBox key={index} index={index + 1} onDrop={(word) => handleDrop(index, word)}>
                {word}
              </DropBox>
            ))}
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
    </div>
  );
};

export default ArticlePage;
