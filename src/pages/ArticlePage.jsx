import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import DraggableWord from '@/components/DraggableWord';
import DropBox from '@/components/DropBox';
import ResultsWindow from '@/components/ResultsWindow';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import data from "../../example_docs/example_doc1.json"; // Ensure this path is correct

// Split words and punctuation
const splitWordsAndPunctuation = (textArray) => {
  const regex = /(\w+)([.,!?;:"]*)/g;
  let result = [];

  textArray.forEach((item) => {
    let match;
    while ((match = regex.exec(item)) !== null) {
      // Push the word and punctuation as separate items
      if (match[1]) result.push(match[1]); // Word
      if (match[2]) result.push(match[2]); // Punctuation
    }
  });

  return result;
};

const textArray = data.doc_text; // Assuming doc_text is an array of strings
const splitTextArray = splitWordsAndPunctuation(textArray);
const combinedText = splitTextArray.join(''); // Joins words and punctuation without spaces

// Simulate fetching the article content
const fetchArticle = async (topicId) => {
  return {
    title: `Article about Topic ${topicId}`,
    content: combinedText,
    instruction: 'Identify the 5 most important words in this article and drag them to the boxes below.'
  };
};

const fetchTimes = () => {
  const storedTimes = localStorage.getItem('savedTimes');
  return storedTimes ? JSON.parse(storedTimes) : [];
};

const saveTime = ({ time, name, articleTitle }) => {
  const times = fetchTimes();
  const existingIndex = times.findIndex(t => t.name === name);
  if (existingIndex !== -1) {
    times[existingIndex] = { name, time, articleTitle };
  } else {
    times.push({ name, time, articleTitle });
  }
  localStorage.setItem('savedTimes', JSON.stringify(times));
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

  const allBoxesFilled = droppedWords.every(word => word !== null);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="max-w-full mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        <p className="text-lg mb-6">{article.instruction}</p>
        <div className="mb-6">
          <Button onClick={handleStartStop} disabled={isTimerRunning && !allBoxesFilled}>
            {isTimerRunning ? 'Stop' : 'Start'}
          </Button>
          <span className="ml-4 text-xl">Timer: {timer}s</span>
        </div>
        <div className="mb-4 flex items-center">
          <Progress value={progress} className="w-full h-4 mr-4" />
          <AnimatePresence>
            {modelDone && (
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                className="text-green-600 font-semibold"
              >
                Done!
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="mb-8">
          {splitTextArray.map((word, index) => (
            <DraggableWord key={index} word={word} disabled={!isTimerRunning || /[.,!?;:"]/.test(word)} />
          ))}
        </div>
        <div className="grid grid-cols-5 gap-4 mb-8">
          {droppedWords.map((word, index) => (
            <DropBox key={index} index={index + 1} onDrop={(word) => handleDrop(index, word)}>
              {word}
            </DropBox>
          ))}
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
