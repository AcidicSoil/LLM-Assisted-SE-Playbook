import { useEffect, useState } from 'react';
import { useStore } from '../app/store';
import { createIndexer } from '../data/indexer';
import { Entity } from '../data/schemas';
import { getEntityLabel } from '../utils/entity';

export default function CommandPalette() {
  const playbook = useStore((s) => s.playbook);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ item: Entity }[]>([]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!playbook) return;
    const indexer = createIndexer(playbook);
    setResults(query ? indexer.search(query).slice(0, 5) : []);
  }, [playbook, query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-start justify-center p-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="bg-white dark:bg-gray-700 p-4 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="w-full p-2 mb-2 text-black"
        />
        <ul>
          {results.map((r) => (
            <li key={r.item.id} className="p-1">
              {getEntityLabel(r.item)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
