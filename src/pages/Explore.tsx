import { useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { useStore, selectNodes } from '../state/store';
import SearchBar from '../components/SearchBar';
import Card from '../components/Card';
import FilterDrawer from '../components/FilterDrawer';

export default function Explore() {
  const load = useStore(s=>s.load);
  const nodes = selectNodes();
  const q = useStore(s=>s.query);
  useEffect(()=>{load();},[load]);
  const fuse = useMemo(()=>new Fuse(nodes,{keys:[{name:'title',weight:0.5},{name:'tags',weight:0.3},{name:'summary',weight:0.2}],threshold:0.3}),[nodes]);
  const results = q? fuse.search(q).map(r=>r.item) : nodes;
  return (
    <main className="p-4">
      <div className="flex gap-2">
        <SearchBar />
        <FilterDrawer />
      </div>
      <div className="mt-4">
        {results.map(n=>(<Card key={n.id} node={n} />))}
      </div>
    </main>
  );
}
