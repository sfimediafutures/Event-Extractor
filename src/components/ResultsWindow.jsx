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

  const allTimes = savedTime
    ? [...times, savedTime]
    : times;

  const sortedTimes = allTimes
    .filter(Boolean)
    .sort((a, b) => a.time - b.time);

  const topTimes = sortedTimes.slice(0, 15);
  const userRank = sortedTimes.findIndex(t => t.time === time) + 1;

  const renderTimeEntry = (entry, index) => (
    <li key={index} className={entry.time === time ? 'font-bold' : ''}>
      Rank {index + 1}: {entry.name} - {entry.time} seconds [{entry.articleTitle}]
    </li>
  );

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
            <h3 className="text-xl font-semibold mb-2">Highscores</h3>
            <ul className="list-disc pl-5 mb-4">
              {topTimes.map((t, index) => renderTimeEntry(t, index))}
            </ul>
            {userRank > 15 && (
              <p className="mb-4">
                Your rank: {userRank} - {savedTime ? savedTime.name : 'You'}: {time} seconds [{currentArticleTitle}]
              </p>
            )}
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