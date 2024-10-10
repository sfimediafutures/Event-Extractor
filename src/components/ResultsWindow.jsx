import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { InfoIcon } from 'lucide-react';

const ResultsWindow = ({ time, times, onSave, onClose }) => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSave = () => {
    onSave(name);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <Card className="p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Your Results</h2>
        <p className="mb-4">Your time: {time} seconds</p>
        <h3 className="text-xl font-semibold mb-2">Ranking</h3>
        <ul className="list-disc pl-5 mb-4">
          {[...times, time].sort((a, b) => a - b).map((t, index) => (
            <li key={index} className={t === time ? 'font-bold' : ''}>
              {t} seconds {t === time ? '(Your Time)' : ''}
            </li>
          ))}
        </ul>
        <p className="mb-4 text-sm italic">
          The Event Extractor model can complete this task in under a second, saving you valuable time.
          <Button
            variant="link"
            className="p-0 h-auto"
            onClick={() => navigate('/model-info')}
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
          <Button onClick={handleSave}>Save Time</Button>
          <Button onClick={() => navigate('/')}>Back to Start</Button>
        </div>
      </Card>
    </div>
  );
};

export default ResultsWindow;