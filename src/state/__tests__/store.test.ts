import { describe, it, expect } from 'vitest';
import { useStore } from '../store';

describe('store', () => {
  it('toggles pins', () => {
    useStore.getState().pins = [];
    useStore.getState().togglePin('a');
    expect(useStore.getState().pins).toContain('a');
    useStore.getState().togglePin('a');
    expect(useStore.getState().pins).not.toContain('a');
  });
  it('sets query', () => {
    useStore.getState().setQuery('hi');
    expect(useStore.getState().query).toBe('hi');
  });
});
