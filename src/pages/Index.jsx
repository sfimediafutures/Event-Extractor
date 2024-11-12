import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const topics = [
  { id: 1, title: 'Satt 37 år i fengsel for en voldtekt han aldri begikk', image: '/doc1_image.jpg' },
  { id: 2, title: "Fotballfrue pågrepet med våpen på flyplass", image: '/doc2_image.webp' },
  { id: 3, title: "Elbilen er forsinket - nå må flere tusen nordmenn vente", image: '/doc3_image.webp' },
  { id: 4, title: "Mann (72) knivdrept i videomøte", image: '/doc4_image.webp' },
  { id: 5, title: "Politiet med båtjakt etter knivepisode", image: '/doc5_image.webp' },
];

const Index = () => {
  const navigate = useNavigate();

  const handleTopicClick = (topicId) => {
    navigate(`/article/${topicId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-top bg-white-100 p-4 mt-20">
      <img className="h-36 mb-10" src="src/img/MF_logo.png" alt="MediaFutures logo"></img>
      <h1 className="text-4xl font-bold mb-8 text-center">Velkommen til Event Extractor!</h1>
      <p className="text-xl text-gray-600 mb-8 text-center">Velg en artikkel som du synes høres interessant ut for å starte demoen</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {topics.map((topic) => (
          <div
            key={topic.id}
            onClick={() => handleTopicClick(topic.id)}
            className="border border-gray-200 rounded-lg flex flex-col items-center justify-top text-center mt-0 bg-transparent hover:bg-gray-200 hover:border-transparent h-auto">
            <img src={topic.image} alt={topic.title} className="w-full h-auto mb-2" />
            <h2 className="text-base font-semibold w-full break-words px-4 py-2 pb-4">
              {topic.title}
            </h2>
          </div>
        ))}
      </div>
    </div>


        // {topics.map((topic) => (
        //   <Button
        //     key={topic.id}
        //     onClick={() => handleTopicClick(topic.id)}
        //     className="w-48 h-48 flex flex-col items-center justify-top text-center px-0 mt-0 border border-black bg-transparent hover:bg-gray-200 hover:border-transparent rounded"
        //   >
        //     <img src={topic.image} alt={topic.title} className="w-full h-24 mb-2" />
        //     <span className="text-black font-semibold hover:text-white">{topic.title}</span>
        //   </Button>
        // ))}
  );
};

export default Index;