import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { InfoIcon } from 'lucide-react';
import ModelInfo from '../pages/ModelInfo';

const ResultsWindow = ({ time, times, onSave, currentArticleTitle }) => {
  const [name, setName] = useState('');
  const [savedTime, setSavedTime] = useState(null);
  const [showModelInfo, setShowModelInfo] = useState(false);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name);
      setSavedTime({ name, time, articleTitle: currentArticleTitle });
    }
  };

  const uniqueTimes = [...times, savedTime]
    .filter(Boolean)
    .reduce((acc, curr) => {
      const existingIndex = acc.findIndex(t => t.name === curr.name);
      if (existingIndex !== -1) {
        acc[existingIndex] = curr;
      } else {
        acc.push(curr);
      }
      return acc;
    }, [])
    .sort((a, b) => a.time - b.time);

  const handleBackToStart = () => {
    window.location.href = '/';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <Card className="p-6 max-w-md w-full">
        {!showModelInfo ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Your Results</h2>
            <p className="mb-4">Your time: {time} seconds</p>
            <h3 className="text-xl font-semibold mb-2">Ranking</h3>
            <ul className="list-disc pl-5 mb-4">
              {uniqueTimes.map((t, index) => (
                <li key={index} className={t.time === time ? 'font-bold' : ''}>
                  {t.name}: {t.time} seconds [{t.articleTitle || currentArticleTitle}] {t.time === time && !savedTime ? '(Your Time)' : ''}
                </li>
              ))}
            </ul>
            <p className="mb-4 text-sm italic">
              The Event Extractor model can complete this task in under a second, saving you valuable time.
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => setShowModelInfo(true)}
              >
                <InfoIcon className="w-4 h-4 ml-1" />
              </Button>
            </p>
            <Input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-4"
            />
            <div className="flex justify-between">
              <Button onClick={handleSave} disabled={!name.trim() || savedTime}>
                {savedTime ? 'Time Saved' : 'Save Time'}
              </Button>
              <Button onClick={handleBackToStart}>Back to Start</Button>
            </div>
          </>
        ) : (
          <>
            <ModelInfo />
            <div className="flex justify-between mt-4">
              <Button onClick={() => setShowModelInfo(false)}>
                Back to Results
              </Button>
              <Button onClick={handleBackToStart}>Back to Start</Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ResultsWindow;