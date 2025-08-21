import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Node } from '../../types/schema';

export default function ScatterPlot({items}:{items:Node[]}) {
  const data = items.map(n=>({x:n.effort,y:n.impact,name:n.title}));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart>
        <XAxis type="number" dataKey="x" name="Effort" domain={[0,5]} />
        <YAxis type="number" dataKey="y" name="Impact" domain={[0,5]} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter data={data} fill="#8884d8" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
