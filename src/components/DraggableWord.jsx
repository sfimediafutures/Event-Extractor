import React from 'react';

const DraggableWord = ({ word }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', word);
  };

  return (
    <span
      draggable
      onDragStart={handleDragStart}
      className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded m-1 cursor-move"
    >
      {word}
    </span>
  );
};

export default DraggableWord;