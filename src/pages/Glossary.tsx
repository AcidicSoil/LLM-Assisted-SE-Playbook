import { useEffect } from 'react';
import { useStore } from '../state/store';

export default function Glossary() {
  const load = useStore(s=>s.load);
  const glossary = useStore(s=>s.dataset?.glossary ?? []);
  useEffect(()=>{load();},[load]);
  return (
    <main className="p-4">
      <h2 className="text-xl">Glossary</h2>
      <ul className="list-disc ml-6">
        {glossary.map(g=>(<li key={g.term}><strong>{g.term}:</strong> {g.definition}</li>))}
      </ul>
    </main>
  );
}
