import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders NODEM title', () => {
    render(<App />);
    expect(screen.getByText('NODEM')).toBeInTheDocument();
  });

  it('shows Interactive Mind Map Presentations subtitle', () => {
    render(<App />);
    expect(screen.getByText('Interactive Mind Map Presentations')).toBeInTheDocument();
  });

  it('displays Clean Slate Ready status', () => {
    render(<App />);
    expect(screen.getByText('Clean Slate Ready')).toBeInTheDocument();
  });

  it('shows Firebase configured checkmark', () => {
    render(<App />);
    expect(screen.getByText('Firebase configured')).toBeInTheDocument();
  });

  it('shows environment hostname', () => {
    render(<App />);
    const hostname = window.location.hostname;
    expect(screen.getByText(hostname)).toBeInTheDocument();
  });

  it('has gradient background', () => {
    const { container } = render(<App />);
    const gradient = container.querySelector('.bg-gradient-to-br');
    expect(gradient).toBeInTheDocument();
  });

  it('displays status card with white background', () => {
    const { container } = render(<App />);
    const statusCard = container.querySelector('.bg-white.rounded-lg');
    expect(statusCard).toBeInTheDocument();
  });

  it('shows pulsing green indicator', () => {
    const { container } = render(<App />);
    const indicator = container.querySelector('.bg-green-500.animate-pulse');
    expect(indicator).toBeInTheDocument();
  });
});
