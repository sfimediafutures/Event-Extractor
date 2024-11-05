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
    .sort((a, b) => a.time - b.time)
    .reduce((acc, current) => {
      const x = acc.find(item => item.name === current.name);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

  const topTimes = sortedTimes.slice(0, 15);
  const userRank = sortedTimes.findIndex(t => t.name === savedTime?.name && t.time === savedTime?.time) + 1;

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `${index + 1}.`;
    }
  };

  const renderTimeEntry = (entry, index) => (
    <li key={index} className={entry.name === savedTime?.name && entry.time === savedTime?.time ? 'font-bold' : ''}>
      <span className="mr-2">{getRankIcon(index)}</span>
      {entry.name} - {entry.time} seconds [{entry.articleTitle}]
    </li>
  );

  const handleBackToStart = () => {
    window.location.href = '/';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <Card className="p-6 max-w-lg w-full">
        {!showModelInfo ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Results</h2>
            <p className="mb-4 text-lg">Your time: {time} seconds</p>
            <h3 className="text-xl font-semibold mb-2">Highscores</h3>
            <ol className="list-none pl-0 mb-4">
              {topTimes.map((t, index) => renderTimeEntry(t, index))}
            </ol>
            {userRank > 15 && (
              <p className="mb-4">
                Your rank: {userRank} - {savedTime ? savedTime.name : 'You'}: {time} seconds [{currentArticleTitle}]
              </p>
            )}
            <Button variant="link" className="mb-4 text-md italic rounded-lg bg-slate-200 px-4 py-2 text-wrap h-auto text-left flex-row gap-4" onClick={() => setShowModelInfo(true)}>
              <InfoIcon className="w-10 h-10" />
              The Event Extractor model can complete this task in 4 seconds, saving you valuable time.
            </Button>
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