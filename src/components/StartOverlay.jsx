import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';

const handleBackToStart = () => {
    window.location.href = '/';
  };

const Overlay = ({ instruction, onStart, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg text-center">
        <h2 className="text-xl font-bold mb-4">Prøv å være fortere enn en NLP!</h2>
        <p className="mb-4">{instruction}</p>
        <button
          className="mr-4 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          onClick={handleBackToStart}
        >
          <FontAwesomeIcon icon={faHouse} />
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={onStart}
        >
          Okay, let's go!
        </button>
      </div>
    </div>
  );
};

export default Overlay;