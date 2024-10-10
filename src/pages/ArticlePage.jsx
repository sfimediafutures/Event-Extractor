import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import DraggableWord from '@/components/DraggableWord';
import DropBox from '@/components/DropBox';
import ResultsWindow from '@/components/ResultsWindow';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Simulated API functions (replace with actual API calls in a real application)
const fetchArticle = async (topicId) => {
  // Simulating API call
  return {
    title: `Article about Topic ${topicId}`,
    content: 'This is a sample article content. You can drag and drop important words from here.',
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

  const handleStartStop = () => {
    if (isTimerRunning && droppedWords.every(word => word !== null)) {
      setIsTimerRunning(false);
      setShowResults(true);
    } else if (!isTimerRunning) {
      setIsTimerRunning(true);
      setTimer(0);
      setDroppedWords(Array(5).fill(null));
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
      <Card className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        <p className="text-lg mb-6">{article.instruction}</p>
        <div className="mb-6">
          <Button onClick={handleStartStop} disabled={isTimerRunning && !allBoxesFilled}>
            {isTimerRunning ? 'Stop' : 'Start'}
          </Button>
          <span className="ml-4 text-xl">Timer: {timer}s</span>
        </div>
        <div className="mb-8">
          {article.content.split(' ').map((word, index) => (
            <DraggableWord key={index} word={word} disabled={!isTimerRunning} />
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