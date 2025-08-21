import { useStore } from '../app/store';
import KpiCard from '../components/KpiCard';
import RoiDifficultyScatter from '../viz/RoiDifficultyScatter';

export default function HomePage() {
  const playbook = useStore((s) => s.playbook);

  if (!playbook) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">LLM Playbook</h1>
      <div>Version: {playbook.version}</div>
      <div>Updated: {playbook.updatedAt}</div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        <KpiCard title="Patterns" value={playbook.patterns.length} />
        <KpiCard title="Workflows" value={playbook.workflows.length} />
        <KpiCard title="Tools" value={playbook.tools.length} />
        <KpiCard title="Prompts" value={playbook.prompts.length} />
        <KpiCard title="Metrics" value={playbook.metrics.length} />
        <KpiCard title="Risks" value={playbook.risks.length} />
      </div>
      <RoiDifficultyScatter patterns={playbook.patterns} />
    </div>
  );
}
