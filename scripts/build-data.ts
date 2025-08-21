import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { glob } from 'glob';
import { remark } from 'remark';
import html from 'remark-html';
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import {
  PlaybookSchema,
  Pattern,
  Workflow,
  Tool,
  Prompt,
  Metric,
  Risk,
} from '../src/data/schemas';

const domPurify = createDOMPurify(new JSDOM('').window as unknown as Window);

type NodeBuckets = {
  patterns: Pattern[];
  workflows: Workflow[];
  tools: Tool[];
  prompts: Prompt[];
  metrics: Metric[];
  risks: Risk[];
};

export async function buildData() {
  const files = await glob('llm-playbook/*.md');
  const buckets: NodeBuckets = {
    patterns: [],
    workflows: [],
    tools: [],
    prompts: [],
    metrics: [],
    risks: [],
  };

  for (const file of files) {
    const raw = readFileSync(file, 'utf-8');
    const { data, content } = matter(raw);
    if (!data.type) continue;

    const body = domPurify.sanitize(
      String(await remark().use(html).process(content)),
    );

    switch (data.type) {
      case 'pattern':
        buckets.patterns.push({
          ...data,
          summary: data.summary ?? '',
          steps: data.steps ?? [],
          bestPractices: data.bestPractices ?? [],
          antiPatterns: data.antiPatterns ?? [],
          prompts: data.prompts ?? [],
          tools: data.tools ?? [],
          metrics: data.metrics ?? [],
          risks: data.risks ?? [],
          tags: data.tags ?? [],
          links: data.links ?? [],
          relations: data.relations ?? [],
        });
        break;
      case 'workflow':
        buckets.workflows.push({
          ...data,
          tags: data.tags ?? [],
          relations: data.relations ?? [],
        });
        break;
      case 'tool':
        buckets.tools.push({
          ...data,
          strengths: data.strengths ?? [],
          limits: data.limits ?? [],
          tags: data.tags ?? [],
          relations: data.relations ?? [],
        });
        break;
      case 'prompt':
        buckets.prompts.push({
          ...data,
          body,
          useCases: data.useCases ?? [],
          inputs: data.inputs ?? [],
          outputs: data.outputs ?? [],
          tags: data.tags ?? [],
          relations: data.relations ?? [],
        });
        break;
      case 'metric':
        buckets.metrics.push({
          ...data,
          tags: data.tags ?? [],
        });
        break;
      case 'risk':
        buckets.risks.push({
          ...data,
          mitigation: data.mitigation ?? [],
          tags: data.tags ?? [],
        });
        break;
      default:
        break;
    }
  }

  const result = {
    version: '0.1.0',
    updatedAt: new Date().toISOString().split('T')[0],
    ...buckets,
  };

  const valid = PlaybookSchema.parse(result);
  const out = join(process.cwd(), 'public/data/playbook.json');
  writeFileSync(out, JSON.stringify(valid, null, 2));
  console.log('playbook.json written');
}

if (import.meta.url === new URL(process.argv[1], 'file://').href) {
  buildData().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

