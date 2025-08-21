import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import Explore from '../Explore';
import { useStore } from '../../state/store';

// preload dataset
beforeAll(async () => {
  useStore.setState({ dataset: await fetchData() as any });
});
async function fetchData(){
  const fs = await import('fs');
  const path = await import('path');
  const raw = fs.readFileSync(path.resolve('public/data/playbook.json'),'utf8');
  return JSON.parse(raw);
}

describe('Explore page', () => {
  it('renders cards', () => {
    render(<Explore />);
    expect(screen.getAllByTestId('card').length).toBeGreaterThan(0);
  });
});
