import React from 'react';

const handleBackToStart = () => {
    window.location.href = '/';
  };

const Overlay = ({ instruction, onStart, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg text-center">
        <h2 className="text-xl font-bold mb-4">Din oppgave</h2>
        <p className="mb-4">{instruction}</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={onStart}
        >
          Start
        </button>
        <button
          className="ml-4 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          onClick={handleBackToStart}
        >
          Back to Selection
        </button>
      </div>
    </div>
  );
};

export default Overlay;