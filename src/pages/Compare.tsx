import { useStore, selectNodes } from '../state/store';

export default function Compare() {
  const pins = useStore(s=>s.pins);
  const nodes = selectNodes().filter(n=>pins.includes(n.id));
  if (!nodes.length) return <main className="p-4">No items pinned.</main>;
  return (
    <main className="p-4">
      <h2 className="text-xl mb-2">Compare</h2>
      <table className="table-auto border">
        <thead>
          <tr>
            <th className="border p-2">Title</th>
            <th className="border p-2">Impact</th>
            <th className="border p-2">Effort</th>
          </tr>
        </thead>
        <tbody>
          {nodes.map(n=>(
            <tr key={n.id}>
              <td className="border p-2">{n.title}</td>
              <td className="border p-2 text-center">{n.impact}</td>
              <td className="border p-2 text-center">{n.effort}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
