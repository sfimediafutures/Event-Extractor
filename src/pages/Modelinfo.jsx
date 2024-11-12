import React from 'react';
import { Card } from '@/components/ui/card';

const ModelInfo = () => {
  return (
    <div className="max-w-2xl w-full">
      <h1 className="text-3xl font-bold mb-4">Event Extractor Model</h1>
      <p className="mb-4">
        Event Extractor, utviklet av <a href="https://mediafutures.no/2021/10/18/huiling-you/" target="_blank" style={{ color: 'blue' }}>Huiling You</a>, er en natural language processing model som er utviklet for å nøyaktig identifisere events og viktig informasjon
        fra tekst. Den kan raskt behandle artikler og trekke ut relevant informasjon, og dermed redusere tiden som trengs for manuell analyse.
      </p>
      <p className="mb-4">
        Key features:
      </p>
      <ul className="list-disc pl-5 mb-4">
        <li>Rask behandling (4 sekunder per artikkel)</li>
        <li>Høy nøyaktighet i identifisering av viktig informasjon</li>
        <li>Evne til å håndtere ulike tekstformater, lengder og språk</li>
      </ul>
    </div>
  );
};

export default ModelInfo;