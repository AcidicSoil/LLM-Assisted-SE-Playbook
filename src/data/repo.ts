import { PlaybookSchema, Playbook } from './schemas';

export async function loadPlaybook(): Promise<Playbook> {
  const res = await fetch('/data/playbook.json');
  const json = await res.json();
  const parsed = PlaybookSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error('Invalid playbook data');
  }
  return parsed.data;
}
