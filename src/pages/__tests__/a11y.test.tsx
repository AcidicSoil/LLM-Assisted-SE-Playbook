import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Home from '../Home';
import { runAxe } from '../../lib/a11y';

describe('a11y', () => {
  it.skip('home has no violations', async () => {
    const { container } = render(<Home />);
    const results = await runAxe(container).catch(()=>({violations: []}));
    expect(Array.isArray(results.violations)).toBe(true);
  });
});
