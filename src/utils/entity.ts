import { Entity } from '../data/schemas';

export function getEntityLabel(e: Entity): string {
  if ('title' in e && typeof e.title === 'string') return e.title;
  if ('name' in e && typeof e.name === 'string') return e.name;
  return e.id;
}
