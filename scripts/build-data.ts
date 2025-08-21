import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const source = join(process.cwd(), 'public/data/playbook.json');
const data = JSON.parse(readFileSync(source, 'utf-8'));
writeFileSync(source, JSON.stringify(data, null, 2));
console.log('playbook.json written');
