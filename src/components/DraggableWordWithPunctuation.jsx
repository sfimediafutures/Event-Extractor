import React from 'react';
import DraggableWord from '@/components/DraggableWord';

const DraggableWordWithPunctuation = ({ item, isTimerRunning }) => (
  <React.Fragment>
    <DraggableWord
      word={item.word + item.punctuation}
      disabled={!isTimerRunning}
    />
    {' '}
  </React.Fragment>
);

export default DraggableWordWithPunctuation;