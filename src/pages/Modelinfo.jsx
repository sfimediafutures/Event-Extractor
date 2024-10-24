import React from 'react';
import { Card } from '@/components/ui/card';

const ModelInfo = () => {
  return (
    <div className="max-w-2xl w-full">
      <h1 className="text-3xl font-bold mb-4">Event Extractor Model</h1>
      <p className="mb-4">
        The Event Extractor model, developed by <a href="https://mediafutures.no/2021/10/18/huiling-you/" target="_blank" style={{ color: 'blue' }}>Huiling You</a>, is a natural language processing model designed to quickly and accurately identify key events and important information
        from text. It can fastly process articles and extract relevant information,
        significantly reducing the time needed for manual analysis.
      </p>
      <p className="mb-4">
        Key features:
      </p>
      <ul className="list-disc pl-5 mb-4">
        <li>Rapid processing (4 seconds per article)</li>
        <li>High accuracy in identifying important information</li>
        <li>Ability to handle various text formats, lengths and languages</li>
      </ul>
    </div>
  );
};

export default ModelInfo;