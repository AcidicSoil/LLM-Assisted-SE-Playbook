import { useEffect } from 'react';
import { useStore, selectNodes } from '../state/store';
import ScatterPlot from '../charts/Scatter';
import Sankey from '../charts/Sankey';
import Matrix from '../charts/Matrix';

export default function Visualize() {
  const load = useStore(s=>s.load);
  const nodes = selectNodes();
  const relations = useStore(s=>s.dataset?.relations ?? []);
  useEffect(()=>{load();},[load]);
  return (
    <main className="p-4 space-y-8">
      <ScatterPlot items={nodes.filter(n=>n.type==='practice')} />
      <Sankey nodes={nodes} relations={relations} />
      <Matrix nodes={nodes} />
    </main>
  );
}
