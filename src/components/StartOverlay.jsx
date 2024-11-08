import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faStopwatch } from '@fortawesome/free-solid-svg-icons';

const handleBackToStart = () => {
    window.location.href = '/';
  };

const Overlay = ({ instruction, onStart, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg text-center text-wrap w-1/3">
        <h2 className="text-xl font-bold mb-4">
          <FontAwesomeIcon icon={faStopwatch} />   Prøv å være raskere enn en språkmodell!   <FontAwesomeIcon icon={faStopwatch} />
        </h2> 
        <p className="mb-4 text-left"><i>I denne demoen skal du konkurrere i «event extraction» mot en språkmodell som er utviklet av <a href="https://mediafutures.no/2021/10/18/huiling-you/" target="_blank" style={{ color: 'blue' }}>Huiling You</a>.</i><br/></p>
        <p className="mb-4 text-left">Du vil se teksten til artikkelen du har valgt. På venstre side er det tre bokser. Finn passende ord i artikkelens første avsnitt, og dra dem til de riktige boksene. Klikk på «Ferdig» for å se resultatene.<br/></p>
        <p className="mb-4 text-left">På høyre side ser du språkmodellen som analyserer hele artikkelen og viser alle registrerte hendelser.</p>
        <p className="mb-4 text-left">En tidtaker starter når du klikker på knappen nedenfor. Lykke til!</p>
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