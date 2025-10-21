import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { createCanvas } from 'canvas';

// Setup canvas for Konva
global.HTMLCanvasElement.prototype.getContext = function () {
  return createCanvas(200, 200).getContext('2d');
} as any;

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((callback) => {
  setTimeout(callback, 0);
  return 0;
});

global.cancelAnimationFrame = vi.fn();

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Custom matchers
expect.extend({});
