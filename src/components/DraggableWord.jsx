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
      className={`inline-block px-0.5 py-0.5 rounded ${
        disabled
          ? 'text-black cursor-auto'
          : 'text-blue-800 cursor-grab'
      }`}
    >
      {word}
    </span>
  );
};

export default DraggableWord;