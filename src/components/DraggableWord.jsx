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
      className={`inline-block px-2 py-1 rounded m-1 ${
        disabled
          ? 'bg-gray-200 text-gray-500 cursor-auto'
          : 'bg-blue-100 text-blue-800 cursor-grab'
      }`}
    >
      {word}
    </span>
  );
};

export default DraggableWord;