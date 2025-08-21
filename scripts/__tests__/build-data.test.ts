import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { execSync } from 'child_process';

describe('build-data script', () => {
  it('writes playbook.json', () => {
    execSync('npx tsx scripts/build-data.ts');
    const content = readFileSync('public/data/playbook.json', 'utf-8');
    expect(JSON.parse(content).version).toBeDefined();
  });
});
