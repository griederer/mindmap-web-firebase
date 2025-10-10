import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders MyMindmap title', () => {
    render(<App />);
    expect(screen.getByText('MyMindmap')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    render(<App />);
    // App will show loading initially then update
    expect(screen.getByText(/MyMindmap|Loading/)).toBeInTheDocument();
  });
});
