import { Node } from '../../types/schema';

export default function Card({node}:{node:Node}) {
  return (
    <div className="border rounded p-2 mb-2" data-testid="card">
      <h3 className="font-semibold">{node.title}</h3>
      {node.summary && <p className="text-sm">{node.summary}</p>}
    </div>
  );
}
