import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Pattern } from '../data/schemas';

function diffToNumber(d: string) {
  return d === 'Beginner' ? 1 : d === 'Intermediate' ? 2 : 3;
}

export default function RoiDifficultyScatter({
  patterns,
}: {
  patterns: Pattern[];
}) {
  const data = patterns.map((p) => ({
    x: diffToNumber(p.difficulty),
    y: p.roi,
    name: p.title,
  }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart>
        <XAxis type="number" dataKey="x" name="Difficulty" domain={[1, 3]} />
        <YAxis type="number" dataKey="y" name="ROI" domain={[0, 10]} />
        <Tooltip
          cursor={{ strokeDasharray: '3 3' }}
          formatter={(v, n, props) => props.payload.name}
        />
        <Scatter data={data} fill="#8884d8" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
