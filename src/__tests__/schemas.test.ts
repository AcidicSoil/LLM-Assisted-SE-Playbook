import { describe, it, expect } from 'vitest';
import { PlaybookSchema } from '../data/schemas';

describe('Playbook schema', () => {
  it('parses minimal valid data', () => {
    const data = {
      version: '1',
      updatedAt: '2024-01-01',
      patterns: [],
      workflows: [],
      tools: [],
      prompts: [],
      metrics: [],
      risks: [],
    };
    expect(PlaybookSchema.parse(data).version).toBe('1');
  });
});
