import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { DatasetSchema } from '../types/schema.ts';
import type { Node, Relation } from '../types/schema.ts';

const playbookDir = path.resolve('llm-playbook');
const outPath = path.resolve('public/data/playbook.json');

function stubDataset() {
  const stages = ['idea','spec','code','review','deploy'];
  const nodes: Node[] = [];
  for (let i=1;i<=5;i++) {
    nodes.push({ id: `stage-${stages[i-1]}`, type:'stage', title: stages[i-1], summary: `Stage ${stages[i-1]}` });
  }
  for (let i=1;i<=12;i++) {
    nodes.push({ id:`p${i}`, type:'practice', title:`Practice ${i}`, summary:`Summary ${i}`, stages:[stages[i%5]], tags:['tag'+(i%3)] , impact: (i%5)+1, effort: ((i+2)%5)+1 });
  }
  const relations: Relation[] = nodes.filter(n=>n.type==='practice').map((n,i)=>({id:`r${i}`, fromId:n.id, toId:`stage-${n.stages[0]}`, kind:'precedes'}));
  return { nodes, relations };
}

function parseMarkdown(filePath:string): Node[] {
  const raw = fs.readFileSync(filePath,'utf8');
  const { content } = matter(raw);
  const nodes: Node[] = [];
  const regex = /^##\s+(.*)$/gm;
  let match;
  while ((match = regex.exec(content))) {
    const title = match[1].trim();
    nodes.push({ id: title.toLowerCase().replace(/[^a-z0-9]+/g,'-'), type:'practice', title });
  }
  return nodes;
}

function build() {
  let nodes: Node[] = [];
  let relations: Relation[] = [];
  if (fs.existsSync(playbookDir)) {
    const files = fs.readdirSync(playbookDir).filter(f=>f.endsWith('.md'));
    if (files.length) {
      files.forEach(f=>{ nodes.push(...parseMarkdown(path.join(playbookDir,f))); });
      if(nodes.length===0){
        const stub = stubDataset(); nodes = stub.nodes; relations = stub.relations;
      } else {
        relations = nodes.map((n,i)=>({id:`r${i}`, fromId:n.id, toId:n.id, kind:'enhances'}));
      }
    } else {
      const stub = stubDataset(); nodes = stub.nodes; relations = stub.relations;
    }
  } else {
    const stub = stubDataset(); nodes = stub.nodes; relations = stub.relations;
  }
  const dataset = { nodes, relations };
  const parsed = DatasetSchema.parse(dataset);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(parsed, null, 2));
  console.log(`wrote ${parsed.nodes.length} nodes`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  build();
}
