import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, basename } from 'path';
import { glob } from 'glob';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import { PlaybookSchema, Pattern, Relation } from '../src/data/schemas';

async function parseMarkdown(file: string): Promise<Pattern> {
  const raw = await readFile(file, 'utf-8');
  const { content, data } = matter(raw);
  const processed = await remark().use(html).process(content);
  const window = new JSDOM('').window;
  const DOMPurify = createDOMPurify(window as unknown as any);
  const clean = DOMPurify.sanitize(processed.toString());
  const id = data.id ?? basename(file, '.md');
  const relations: Relation[] = Array.isArray(data.relations) ? data.relations : [];
  const pattern: Pattern = {
    id,
    title: data.title ?? id,
    summary: data.summary ?? '',
    phase: data.phase ?? 'Ideation',
    difficulty: data.difficulty ?? 'Beginner',
    roi: data.roi ?? 0,
    steps: data.steps ?? [],
    bestPractices: data.bestPractices ?? [],
    antiPatterns: data.antiPatterns,
    prompts: data.prompts,
    tools: data.tools,
    metrics: data.metrics,
    risks: data.risks,
    tags: data.tags ?? [],
    links: data.links,
    relations,
  };
  // attach sanitized HTML summary if provided via content
  if (!pattern.summary && clean) {
    pattern.summary = clean;
  }
  return pattern;
}

async function build() {
  const files = glob.sync('llm-playbook/*.md');
  const patterns: Pattern[] = [];
  for (const file of files) {
    patterns.push(await parseMarkdown(file));
  }
  const dataset = {
    version: '0.1.0',
    updatedAt: new Date().toISOString(),
    patterns,
    workflows: [],
    tools: [],
    prompts: [],
    metrics: [],
    risks: [],
  };
  const valid = PlaybookSchema.parse(dataset);
  await mkdir(join('public', 'data'), { recursive: true });
  await writeFile(join('public', 'data', 'playbook.json'), JSON.stringify(valid, null, 2));
  console.log('playbook.json written');
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
