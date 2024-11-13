import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faStopwatch } from '@fortawesome/free-solid-svg-icons';

const handleBackToStart = () => {
    window.location.href = '/';
  };

const Overlay = ({ instruction, onStart, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg text-center text-wrap w-5/12">
        <h2 className="text-xl font-bold mb-4">
          <FontAwesomeIcon icon={faStopwatch} className='pr-1'/>   Er du raskere enn en språkmodell?   <FontAwesomeIcon icon={faStopwatch}/>
        </h2> 
        <div className="w-fit px-1 py-2 bg-slate-300 rounded-lg flex align-center justify-center"><p className="text-center">I denne demoen skal du konkurrere i «event extraction» mot en språkmodell som er utviklet av <a href="https://mediafutures.no/2021/10/18/huiling-you/" target="_blank" style={{ color: 'blue' }}>Huiling You</a>.</p></div><br/>
        <p className="mb-4 text-left">Du vil se teksten til artikkelen du har valgt. På venstre side er det fire bokser. Finn passende ord eller uttrykk i artikkelens første setningen, og dra dem til riktige boksene. Klikk på "Ferdig" når du har fylt alle bokser for å stoppe tidtakeren og se resultatene.<br/></p>
        <p className="mb-4 text-left">På høyre side ser du språkmodellen som analyserer hele artikkelen og viser alle registrerte hendelser.</p>
        <p className="mb-4 text-left">En tidtaker starter når du klikker på knappen nedenfor. Lykke til!</p>
        <button
          className="mr-4 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          onClick={handleBackToStart}
        >
          <FontAwesomeIcon icon={faHouse} /> Tilbake
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