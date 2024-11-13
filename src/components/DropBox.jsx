import React from 'react';

const DropBox = ({ index, children, onDrop, isCorrect }) => {
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
      className={`border-2 border-dashed rounded-lg p-4 h-24 flex items-center justify-center text-center transition-colors duration-300 ${
        isCorrect 
          ? 'bg-green-100 border-green-500 text-green-800' 
          : 'bg-slate-100 border-none border-grey-300'
      }`}
      // className="border-2 border-solid border-slate-100 bg-slate-100 rounded-lg p-4 h-24 flex items-center justify-center text-center"
    >
      {children || <span className="text-gray-500">Box {index}</span>}
    </div>
  );
};

export default DropBox;