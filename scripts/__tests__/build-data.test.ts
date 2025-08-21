import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { promises as fs } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { PlaybookSchema } from '../../src/data/schemas';

const fixture = `---
type: pattern
id: test-pattern
title: Test Pattern
summary: Test summary
phase: Ideation
difficulty: Beginner
roi: 1
steps:
  - step
bestPractices:
  - best
tags:
  - tag
---
Content`;

describe('build-data script', () => {
  const mdPath = join('llm-playbook', 'test.md');

  beforeAll(async () => {
    await fs.writeFile(mdPath, fixture);
  });

  afterAll(async () => {
    await fs.unlink(mdPath);
  });

  it('parses markdown and validates schema', async () => {
    execSync('npm run data', { stdio: 'inherit' });
    const content = await fs.readFile('public/data/playbook.json', 'utf8');
    const json = JSON.parse(content);
    expect(() => PlaybookSchema.parse(json)).not.toThrow();
    expect(
      json.patterns.find((p: any) => p.id === 'test-pattern'),
    ).toBeDefined();
  });
});
