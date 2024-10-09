import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import DraggableWord from '@/components/DraggableWord';
import DropBox from '@/components/DropBox';

const ArticlePage = () => {
  const { topicId } = useParams();
  const [article, setArticle] = useState({ title: '', content: '', instruction: '' });
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [droppedWords, setDroppedWords] = useState(Array(5).fill(null));

  useEffect(() => {
    // Simulating article fetch based on topicId
    setArticle({
      title: `Article about ${topicId}`,
      content: 'This is a sample article content. You can drag and drop important words from here.This is a sample article content. You can drag and drop important words from here.This is a sample article content. You can drag and drop important words from here.This is a sample article content. You can drag and drop important words from here.This is a sample article content. You can drag and drop important words from here.This is a sample article content. You can drag and drop important words from here.',
      instruction: 'Start the timer and drag the correct words from the text to the boxes.'
    });
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

  const handleStart = () => {
    setIsTimerRunning(true);
  };

  const handleDrop = (index, word) => {
    if (!isTimerRunning) return;
    setDroppedWords((prev) => {
      const newDroppedWords = [...prev];
      newDroppedWords[index] = word;
      return newDroppedWords;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        <p className="text-lg mb-6">{article.instruction}</p>
        <div className="mb-6">
          <Button onClick={handleStart} disabled={isTimerRunning}>
            {isTimerRunning ? 'Started' : 'Start'}
          </Button>
          <span className="ml-4 text-xl">Timer: {timer}s</span>
        </div>
        <div className="mb-8">
          {article.content.split(' ').map((word, index) => (
            <DraggableWord key={index} word={word} disabled={!isTimerRunning} />
          ))}
        </div>
        <div className="grid grid-cols-5 gap-4">
          {droppedWords.map((word, index) => (
            <DropBox key={index} index={index + 1} onDrop={(word) => handleDrop(index, word)}>
              {word}
            </DropBox>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ArticlePage;