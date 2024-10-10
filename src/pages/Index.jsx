import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const topics = [
  { id: 1, title: 'Science', image: '/placeholder.svg' },
  { id: 2, title: 'History', image: '/placeholder.svg' },
  { id: 3, title: 'Technology', image: '/placeholder.svg' },
  { id: 4, title: 'Arts', image: '/placeholder.svg' },
  { id: 5, title: 'Sports', image: '/placeholder.svg' },
];

const Index = () => {
  const navigate = useNavigate();

  const handleTopicClick = (topicId) => {
    navigate(`/article/${topicId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white-100 p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Velkommen til Event Extractor demoen!</h1>
      <p className="text-xl text-gray-600 mb-8 text-center">Velg en artikkel som du synes høres interessant ut for å starte demoen</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {topics.map((topic) => (
          <Button
            key={topic.id}
            onClick={() => handleTopicClick(topic.id)}
            className="w-48 h-48 flex flex-col items-center justify-top text-center px-0 mt-0 border border-black bg-transparent hover:bg-gray-200 hover:border-transparent rounded"
          >
            <img src={topic.image} alt={topic.title} className="w-full h-24 mb-2" />
            <span className="text-black font-semibold hover:text-white">{topic.title}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Index;