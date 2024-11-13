// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card } from '@/components/ui/card';
// import { InfoIcon } from 'lucide-react';
// import ModelInfo from '../pages/ModelInfo';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faHouse, faStopwatch } from '@fortawesome/free-solid-svg-icons';

// const ResultsWindow = ({ time, times, onSave, currentArticleTitle }) => {
//   const [name, setName] = useState('');
//   const [savedTime, setSavedTime] = useState(null);
//   const [showModelInfo, setShowModelInfo] = useState(false);

//   const handleSave = () => {
//     if (name.trim()) {
//       onSave(name);
//       setSavedTime({ name, time, articleTitle: currentArticleTitle });
//     }
//   };

//   const allTimes = savedTime
//     ? [...times, savedTime]
//     : times;

//   const sortedTimes = allTimes
//     .filter(Boolean)
//     .sort((a, b) => a.time - b.time)
//     .reduce((acc, current) => {
//       const x = acc.find(item => item.name === current.name);
//       if (!x) {
//         return acc.concat([current]);
//       } else {
//         return acc;
//       }
//     }, []);

//   const topTimes = sortedTimes.slice(0, 15);
//   const userRank = sortedTimes.findIndex(t => t.name === savedTime?.name && t.time === savedTime?.time) + 1;

//   const getRankIcon = (index) => {
//     switch (index) {
//       case 0: return '🥇';
//       case 1: return '🥈';
//       case 2: return '🥉';
//       default: return `${index + 1}.`;
//     }
//   };

//   const renderTimeEntry = (entry, index) => (
//     <li key={index} className={entry.name === savedTime?.name && entry.time === savedTime?.time ? 'font-bold' : ''}>
//       <span className="mr-2">{getRankIcon(index)}</span>
//       {entry.name} - {entry.time} seconds [{entry.articleTitle}]
//     </li>
//   );

//   const handleBackToStart = () => {
//     window.location.href = '/';
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//       <Card className="p-6 max-w-lg w-full">
//         {!showModelInfo ? (
//           <>
//             <h2 className="text-2xl font-bold mb-4">Resultater</h2>
//             <p className="mb-4 text-lg">Din tid: {time} sekunder</p>
//             <h3 className="text-xl font-semibold mb-2">Highscores</h3>
//             <ol className="list-none pl-0 mb-4">
//               {topTimes.map((t, index) => renderTimeEntry(t, index))}
//             </ol>
//             {userRank > 15 && (
//               <p className="mb-4">
//                 Din plassering: {userRank} - {savedTime ? savedTime.name : 'You'}: {time} sekunder [{currentArticleTitle}]
//               </p>
//             )}
//             <Button variant="link" className="mb-4 text-md rounded-lg bg-slate-200 px-4 py-2 text-wrap h-auto text-left flex-row gap-3" onClick={() => setShowModelInfo(true)}>
//               <InfoIcon className="w-12 h-12" />
//               Språkmodellen hentet ut alle hendelsene i artikkelen på 4 sekunder! Vil du lære mer om det? Klikk her!
//             </Button>
//             <Input
//               type="text"
//               placeholder="Enter your name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="mb-4"
//             />
//             <div className="flex justify-between">
//               <Button onClick={handleSave} disabled={!name.trim() || savedTime}>
//                 {savedTime ? 'Time Saved' : 'Save Time'}
//               </Button>
//               <Button onClick={handleBackToStart}><FontAwesomeIcon className="mr-2" icon={faHouse} />Tilbake </Button>
//             </div>
//           </>
//         ) : (
//           <>
//             <ModelInfo />
//             <div className="flex justify-between mt-4">
//               <Button onClick={() => setShowModelInfo(false)}>
//                 Back to Results
//               </Button>
//               <Button onClick={handleBackToStart}><FontAwesomeIcon icon={faHouse} /></Button>
//             </div>
//           </>
//         )}
//       </Card>
//     </div>
//   );
// };

// export default ResultsWindow;

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { InfoIcon } from 'lucide-react';
import ModelInfo from '../pages/ModelInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faStopwatch, faTrophy, faMedal, faRankingStar } from '@fortawesome/free-solid-svg-icons';

const ResultsWindow = ({ time, times, onSave, currentArticleTitle }) => {
  const [name, setName] = useState('');
  const [savedTime, setSavedTime] = useState(null);
  const [showModelInfo, setShowModelInfo] = useState(false);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name);
      setSavedTime({ name, time, articleTitle: currentArticleTitle });
    }
  };

  const allTimes = savedTime
    ? [...times, savedTime]
    : times;

  const sortedTimes = allTimes
    .filter(Boolean)
    .sort((a, b) => a.time - b.time)
    .reduce((acc, current) => {
      const x = acc.find(item => item.name === current.name);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

  const topTimes = sortedTimes.slice(0, 10);
  const userRank = sortedTimes.findIndex(t => t.name === savedTime?.name && t.time === savedTime?.time) + 1;

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return <FontAwesomeIcon icon={faTrophy} className="text-yellow-400" />;
      case 1: return <FontAwesomeIcon icon={faMedal} className="text-gray-400" />;
      case 2: return <FontAwesomeIcon icon={faMedal} className="text-amber-600" />;
      default: return <span className="w-6 text-center">{index + 1}</span>;
    }
  };

  const renderTimeEntry = (entry, index) => (
    <li 
      key={index} 
      className={`flex items-center p-2 rounded-lg mb-2 ${
        entry.name === savedTime?.name && entry.time === savedTime?.time 
          ? 'bg-blue-50 border border-blue-200' 
          : index % 2 === 0 
            ? 'bg-gray-50' 
            : 'bg-white'
      }`}
    >
      <div className="w-8 text-lg flex justify-center items-center">
        {getRankIcon(index)}
      </div>
      <div className="flex-1 ml-3">
        <span className="font-semibold">{entry.name}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-600">{entry.time}s</span>
        <FontAwesomeIcon icon={faStopwatch} className="text-gray-400" />
      </div>
      {/* <div className="ml-4 text-sm text-gray-500 hidden sm:block">
        [{entry.articleTitle}]
      </div> */}
    </li>
  );

  const handleBackToStart = () => {
    window.location.href = '/';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <Card className="p-6 max-w-lg w-full h-fit">
        {!showModelInfo ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Resultater</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 mb-6 w-fit">
              <p className="text-lg font-semibold text-green-800">Din tid: {time} sekunder</p>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faRankingStar} className="text-blue-500" />
                Highscores
              </h3>
              <ol className="list-none pl-0 space-y-1">
                {topTimes.map((t, index) => renderTimeEntry(t, index))}
              </ol>
              {userRank > 10 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-600">
                    Din plassering: {userRank} - {savedTime ? savedTime.name : 'You'}: {time} sekunder
                  </p>
                </div>
              )}
            </div>
            <Button 
              variant="link" 
              className="mb-4 text-md rounded-lg bg-slate-200 px-4 py-2 text-wrap h-auto text-left flex items-center gap-3" 
              onClick={() => setShowModelInfo(true)}
            >
              <InfoIcon className="w-12 h-12"/>
              <span>Språkmodellen hentet ut alle hendelsene i artikkelen på 4 sekunder! Vil du lære mer om det? Klikk her!</span>
            </Button>
            <Input
              type="text"
              placeholder="Skriv navnet ditt"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-4"
            />
            <div className="flex justify-between">
              <Button 
                onClick={handleSave} 
                disabled={!name.trim() || savedTime}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {savedTime ? 'Tid lagret' : 'Lagre tid'}
              </Button>
              <Button onClick={handleBackToStart}>
                <FontAwesomeIcon className="mr-2" icon={faHouse} />
                Tilbake
              </Button>
            </div>
          </>
        ) : (
          <>
            <ModelInfo />
            <div className="flex justify-between mt-4">
              <Button onClick={() => setShowModelInfo(false)}>
                Tilbake til resultater
              </Button>
              <Button onClick={handleBackToStart}>
                <FontAwesomeIcon icon={faHouse} />
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ResultsWindow;