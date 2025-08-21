import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../app/store';
import SearchInput from '../../components/SearchInput';
import { Pattern } from '../../data/schemas';
import { createPatternIndexer } from '../../data/indexer';

export default function ExplorerPage() {
  const playbook = useStore((s) => s.playbook);
  const [query, setQuery] = useState('');
  const [phase, setPhase] = useState('');
  const [sort, setSort] = useState('roi');
  const [results, setResults] = useState<Pattern[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (!playbook) return;
    let items = playbook.patterns;
    if (phase) items = items.filter((p) => p.phase === phase);
    if (query) {
      const index = createPatternIndexer(items);
      items = index.search(query).map((r) => r.item);
    }
    if (sort === 'roi') items = [...items].sort((a, b) => b.roi - a.roi);
    if (sort === 'difficulty')
      items = [...items].sort((a, b) =>
        a.difficulty.localeCompare(b.difficulty),
      );
    setResults(items);
  }, [playbook, query, phase, sort]);

  if (!playbook) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <SearchInput
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search patterns"
        />
        <select
          value={phase}
          onChange={(e) => setPhase(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Phases</option>
          {[...new Set(playbook.patterns.map((p) => p.phase))].map((ph) => (
            <option key={ph} value={ph}>
              {ph}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="roi">ROI</option>
          <option value="difficulty">Difficulty</option>
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {results.map((p) => (
          <div key={p.id} className="p-4 border rounded">
            <h3 className="font-bold">{p.title}</h3>
            <div className="text-sm">{p.summary}</div>
            <div className="text-xs mt-2 flex gap-2">
              <span className="px-2 py-1 bg-gray-200 rounded">{p.phase}</span>
              <span className="px-2 py-1 bg-gray-200 rounded">
                {p.difficulty}
              </span>
              <span className="px-2 py-1 bg-gray-200 rounded">ROI {p.roi}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
