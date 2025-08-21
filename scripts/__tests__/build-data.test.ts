import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { DatasetSchema } from '../../types/schema';
import '../build-data';

describe('build-data', () => {
  it('produces valid dataset', () => {
    const p = path.resolve('public/data/playbook.json');
    const raw = fs.readFileSync(p, 'utf8');
    const parsed = JSON.parse(raw);
    const data = DatasetSchema.parse(parsed);
    expect(data.nodes.length).toBeGreaterThan(0);
  });
});
