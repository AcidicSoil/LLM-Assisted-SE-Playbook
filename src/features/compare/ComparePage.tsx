import { useStore } from '../../app/store';

export default function ComparePage() {
  const playbook = useStore((s) => s.playbook);
  if (!playbook) return <div>Loading...</div>;
  const items = playbook.patterns.slice(0, 3);
  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr>
          <th className="border p-2">Title</th>
          <th className="border p-2">Phase</th>
          <th className="border p-2">Difficulty</th>
          <th className="border p-2">ROI</th>
          <th className="border p-2">Best Practices</th>
        </tr>
      </thead>
      <tbody>
        {items.map((p) => (
          <tr key={p.id}>
            <td className="border p-2">{p.title}</td>
            <td className="border p-2">{p.phase}</td>
            <td className="border p-2">{p.difficulty}</td>
            <td className="border p-2">{p.roi}</td>
            <td className="border p-2">{p.bestPractices.join(', ')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
