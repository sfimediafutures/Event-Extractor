import React from 'react';

const DropBox = ({ index, children, onDrop }) => {
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const word = e.dataTransfer.getData('text/plain');
    onDrop(word);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="border-2 border-dashed border-gray-300 rounded p-4 h-24 flex items-center justify-center text-center"
    >
      {children || <span className="text-gray-500">Box {index}</span>}
    </div>
  );
};

export default DropBox;