import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import { PlaybookSchema } from '../../src/data/schemas';

describe('build-data script', () => {
  it('parses markdown and validates schema', () => {
    execSync('npx tsx scripts/build-data.ts', { stdio: 'inherit' });
    const content = readFileSync('public/data/playbook.json', 'utf-8');
    const json = JSON.parse(content);
    const parsed = PlaybookSchema.parse(json);
    expect(parsed.patterns.length).toBeGreaterThan(0);
  });
});
