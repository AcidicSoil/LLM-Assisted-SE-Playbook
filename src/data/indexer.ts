import Fuse from 'fuse.js';
import { Playbook } from './schemas';

export function createIndexer(playbook: Playbook) {
  const list: any[] = [
    ...playbook.patterns,
    ...playbook.workflows,
    ...playbook.tools,
    ...playbook.prompts,
    ...playbook.metrics,
    ...playbook.risks,
  ];
  return new Fuse(list, {
    keys: [
      { name: 'title', weight: 0.5 },
      { name: 'name', weight: 0.5 },
      { name: 'tags', weight: 0.3 },
      { name: 'summary', weight: 0.2 },
    ],
    threshold: 0.3,
  });
}
