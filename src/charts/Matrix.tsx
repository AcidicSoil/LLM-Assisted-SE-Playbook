import { Node } from '../../types/schema';

interface Props { nodes: Node[]; }
export default function Matrix({nodes}:Props) {
  const stages = Array.from(new Set(nodes.flatMap(n=>n.stages)));
  const types = Array.from(new Set(nodes.map(n=>n.type)));
  return (
    <table className="border mt-4" aria-label="Stage type matrix">
      <thead>
        <tr>
          <th className="border p-1"></th>
          {types.map(t=>(<th key={t} className="border p-1">{t}</th>))}
        </tr>
      </thead>
      <tbody>
        {stages.map(stage=>(
          <tr key={stage}>
            <td className="border p-1">{stage}</td>
            {types.map(t=>{
              const count = nodes.filter(n=>n.type===t && n.stages.includes(stage)).length;
              return <td key={t} className="border p-1 text-center">{count}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
