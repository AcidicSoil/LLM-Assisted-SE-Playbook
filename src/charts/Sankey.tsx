import { useMemo } from 'react';
import { sankey as d3sankey, sankeyLinkHorizontal } from 'd3-sankey';
import { Node, Relation } from '../../types/schema';

interface Props { nodes: Node[]; relations: Relation[]; }
export default function Sankey({nodes, relations}:Props) {
  const {graph, width, height} = useMemo(()=>{
    const s = d3sankey<any, any>().nodeWidth(15).nodePadding(10);
    const data = { nodes: nodes.map(n=>({name:n.title})), links: relations.map(r=>({source:nodes.findIndex(n=>n.id===r.fromId), target:nodes.findIndex(n=>n.id===r.toId), value:1}))};
    const g = s(data);
    return {graph:g,width:600,height:400};
  },[nodes,relations]);
  return (
    <svg width={width} height={height} role="img" aria-label="Sankey diagram">
      {graph.links.map((l:any,i:number)=>(
        <path key={i} d={sankeyLinkHorizontal()(l)} stroke="#8884d8" fill="none" strokeWidth={Math.max(1,l.width)} />
      ))}
      {graph.nodes.map((n:any,i:number)=>(
        <g key={i}>
          <rect x={n.x0} y={n.y0} width={n.x1-n.x0} height={n.y1-n.y0} fill="#444" />
          <text x={n.x0} y={n.y0} dy="1em" fill="#fff">{n.name}</text>
        </g>
      ))}
    </svg>
  );
}
