import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';

// Mock fetch for demo project
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        projectId: 'demo-1',
        rootNodeId: 'root',
        nodes: {
          root: {
            id: 'root',
            title: 'NODEM',
            description: 'Interactive Mind Map Presentations',
            children: [],
            level: 0,
            parentId: null,
            position: { x: 100, y: 300 },
            isExpanded: true,
            isVisible: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        },
        actions: [],
        settings: {
          defaultZoom: 1,
          defaultPosition: { x: 0, y: 0 },
          theme: 'light',
        },
      }),
  } as Response)
);

describe('App', () => {
  it('renders NODEM title in header', () => {
    const { container } = render(<App />);
    expect(container.textContent).toContain('NODEM');
  });

  it('has header with proper styling', () => {
    const { container } = render(<App />);
    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
    expect(header?.className).toContain('bg-white');
  });

  it('renders Canvas component', () => {
    const { container } = render(<App />);
    const canvas = container.querySelector('.w-full.h-full.bg-gray-50');
    expect(canvas).toBeInTheDocument();
  });

  it('shows environment hostname in header', () => {
    const { container } = render(<App />);
    const hostname = window.location.hostname;
    expect(container.textContent).toContain(hostname);
  });
});
