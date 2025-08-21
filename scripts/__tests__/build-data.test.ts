import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { writeFileSync, readFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { PlaybookSchema } from '../../src/data/schemas';
import { buildData } from '../build-data';

const tmp = join(process.cwd(), 'llm-playbook', 'test.md');

describe('build-data pipeline', () => {
  beforeAll(() => {
    writeFileSync(
      tmp,
      `---\n` +
        `type: prompt\n` +
        `id: test\n` +
        `title: Test\n` +
        `useCases: [Testing]\n` +
        `tags: [test]\n` +
        `relations: []\n` +
        `---\n` +
        `Hello <script>alert('x')</script>`,
    );
  });

  afterAll(() => {
    unlinkSync(tmp);
  });

  it('parses markdown and validates schema', async () => {
    await buildData();
    const raw = readFileSync(
      join(process.cwd(), 'public/data/playbook.json'),
      'utf-8',
    );
    const data = JSON.parse(raw);
    expect(() => PlaybookSchema.parse(data)).not.toThrow();
    const prompt = data.prompts.find((p: { id: string }) => p.id === 'test');
    expect(prompt.body).toContain('Hello');
    expect(prompt.body).not.toContain('script');
  });
});
