import { promises as fs } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { glob } from 'glob';
import { remark } from 'remark';
import html from 'remark-html';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import {
  PlaybookSchema,
  Pattern,
  Workflow,
  Tool,
  Prompt,
  Metric,
  Risk,
} from '../src/data/schemas';
import pkg from '../package.json' assert { type: 'json' };

const dompurify = createDOMPurify(new JSDOM('').window as unknown as Window);

type EntityType =
  | 'pattern'
  | 'workflow'
  | 'tool'
  | 'prompt'
  | 'metric'
  | 'risk';

async function build() {
  const files = await glob('llm-playbook/*.md');

  const playbook: {
    version: string;
    updatedAt: string;
    patterns: Pattern[];
    workflows: Workflow[];
    tools: Tool[];
    prompts: Prompt[];
    metrics: Metric[];
    risks: Risk[];
  } = {
    version: pkg.version,
    updatedAt: new Date().toISOString().slice(0, 10),
    patterns: [],
    workflows: [],
    tools: [],
    prompts: [],
    metrics: [],
    risks: [],
  };

  for (const file of files) {
    const raw = await fs.readFile(file, 'utf8');
    const { data, content } = matter(raw);
    const type = data.type as EntityType | undefined;
    if (!type) continue;

    const sanitized = dompurify.sanitize(
      String(await remark().use(html).process(content)),
    );

    const base = { ...data, relations: data.relations ?? [] };

    if (!base.body && sanitized) base.body = sanitized;
    if (!base.desc && sanitized) base.desc = sanitized;

    switch (type) {
      case 'pattern':
        playbook.patterns.push(base as Pattern);
        break;
      case 'workflow':
        playbook.workflows.push(base as Workflow);
        break;
      case 'tool':
        playbook.tools.push(base as Tool);
        break;
      case 'prompt':
        playbook.prompts.push(base as Prompt);
        break;
      case 'metric':
        playbook.metrics.push(base as Metric);
        break;
      case 'risk':
        playbook.risks.push(base as Risk);
        break;
      default:
        break;
    }
  }

  const parsed = PlaybookSchema.parse(playbook);

  const outDir = join(process.cwd(), 'public/data');
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(
    join(outDir, 'playbook.json'),
    JSON.stringify(parsed, null, 2),
  );
  console.log('playbook.json written');
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
