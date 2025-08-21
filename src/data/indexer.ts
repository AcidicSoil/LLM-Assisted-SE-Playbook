import Fuse from 'fuse.js';
import { Playbook, Pattern, Entity } from './schemas';

export function createIndexer(playbook: Playbook) {
  const list: Entity[] = [
    ...playbook.patterns,
    ...playbook.workflows,
    ...playbook.tools,
    ...playbook.prompts,
    ...playbook.metrics,
    ...playbook.risks,
  ];
  return new Fuse<Entity>(list, {
    keys: [
      { name: 'title', weight: 0.5 },
      { name: 'name', weight: 0.5 },
      { name: 'tags', weight: 0.3 },
      { name: 'summary', weight: 0.2 },
    ],
    threshold: 0.3,
  });
}

export function createPatternIndexer(patterns: Pattern[]) {
  return new Fuse<Pattern>(patterns, {
    keys: [
      { name: 'title', weight: 0.6 },
      { name: 'tags', weight: 0.3 },
      { name: 'summary', weight: 0.1 },
    ],
    threshold: 0.3,
  });
}
