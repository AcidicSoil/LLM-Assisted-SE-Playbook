import Fuse from 'fuse.js';
import { Node } from '../../types/schema';

export const createFuse = (items:Node[]) => new Fuse(items, {
  keys: [
    { name: 'title', weight: 0.5 },
    { name: 'tags', weight: 0.3 },
    { name: 'summary', weight: 0.2 },
  ],
  threshold: 0.3,
  tokenize: true,
});
