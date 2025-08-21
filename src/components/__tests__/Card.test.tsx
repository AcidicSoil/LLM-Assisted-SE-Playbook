import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import Card from '../Card';

describe('Card', () => {
  it('shows title and summary', () => {
    render(<Card node={{id:'1', type:'practice', title:'T', summary:'S', impact:1, effort:1}} /> as any);
    expect(screen.getByText('T')).toBeInTheDocument();
    expect(screen.getByText('S')).toBeInTheDocument();
  });
});
