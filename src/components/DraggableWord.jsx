import React from 'react';

const DraggableWord = ({ word, disabled }) => {
  const handleDragStart = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('text/plain', word);
  };

  return (
    <span
      draggable={!disabled}
      onDragStart={handleDragStart}
      className={`inline-block px-1 py-1 rounded ${
        disabled
          ? 'text-gray-500 cursor-auto'
          : 'text-blue-800 cursor-grab'
      }`}
    >
      {word}
    </span>
  );
};

export default DraggableWord;