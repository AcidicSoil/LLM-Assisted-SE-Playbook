import { useStore } from '../../app/store';

export default function PromptLabPage() {
  const playbook = useStore((s) => s.playbook);
  if (!playbook) return <div>Loading...</div>;
  return (
    <div className="grid gap-4">
      {playbook.prompts.map((p) => (
        <div key={p.id} className="p-4 border rounded">
          <h3 className="font-bold">{p.title}</h3>
          <pre className="whitespace-pre-wrap bg-gray-100 p-2 mt-2">
            {p.body}
          </pre>
          <button
            className="mt-2 px-2 py-1 border rounded"
            onClick={() => navigator.clipboard.writeText(p.body)}
          >
            Copy
          </button>
        </div>
      ))}
    </div>
  );
}
