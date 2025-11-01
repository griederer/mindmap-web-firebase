/**
 * Tests for useEscapeKey hook
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useEscapeKey } from './useEscapeKey';

describe('useEscapeKey', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Hook initialization', () => {
    it('should initialize without errors', () => {
      const onEscape = vi.fn();

      const { result } = renderHook(() =>
        useEscapeKey({
          onEscape,
          enabled: true,
        })
      );

      expect(result.current).toBeUndefined(); // Hook returns void
    });

    it('should add event listener when enabled', () => {
      const onEscape = vi.fn();
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

      renderHook(() =>
        useEscapeKey({
          onEscape,
          enabled: true,
        })
      );

      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });

    it('should not add event listener when disabled', () => {
      const onEscape = vi.fn();
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

      renderHook(() =>
        useEscapeKey({
          onEscape,
          enabled: false,
        })
      );

      expect(addEventListenerSpy).not.toHaveBeenCalledWith('keydown', expect.any(Function));
    });

    it('should clean up event listener on unmount', () => {
      const onEscape = vi.fn();
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = renderHook(() =>
        useEscapeKey({
          onEscape,
          enabled: true,
        })
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });
  });

  describe('Escape key handling', () => {
    it('should call onEscape when Escape key pressed', () => {
      const onEscape = vi.fn();

      renderHook(() =>
        useEscapeKey({
          onEscape,
          enabled: true,
        })
      );

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      window.dispatchEvent(event);

      expect(onEscape).toHaveBeenCalledTimes(1);
    });

    it('should not call onEscape when disabled', () => {
      const onEscape = vi.fn();

      renderHook(() =>
        useEscapeKey({
          onEscape,
          enabled: false,
        })
      );

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      window.dispatchEvent(event);

      expect(onEscape).not.toHaveBeenCalled();
    });

    it('should not call onEscape for other keys', () => {
      const onEscape = vi.fn();

      renderHook(() =>
        useEscapeKey({
          onEscape,
          enabled: true,
        })
      );

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      window.dispatchEvent(event);

      expect(onEscape).not.toHaveBeenCalled();
    });

    it('should handle multiple Escape presses', () => {
      const onEscape = vi.fn();

      renderHook(() =>
        useEscapeKey({
          onEscape,
          enabled: true,
        })
      );

      const event1 = new KeyboardEvent('keydown', { key: 'Escape' });
      const event2 = new KeyboardEvent('keydown', { key: 'Escape' });
      const event3 = new KeyboardEvent('keydown', { key: 'Escape' });

      window.dispatchEvent(event1);
      window.dispatchEvent(event2);
      window.dispatchEvent(event3);

      expect(onEscape).toHaveBeenCalledTimes(3);
    });
  });

  describe('Input field focus prevention', () => {
    it('should not trigger when input field is focused', () => {
      const onEscape = vi.fn();
      const input = document.createElement('input');
      document.body.appendChild(input);
      input.focus();

      renderHook(() =>
        useEscapeKey({
          onEscape,
          enabled: true,
        })
      );

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      window.dispatchEvent(event);

      expect(onEscape).not.toHaveBeenCalled();

      document.body.removeChild(input);
    });

    it('should not trigger when textarea is focused', () => {
      const onEscape = vi.fn();
      const textarea = document.createElement('textarea');
      document.body.appendChild(textarea);
      textarea.focus();

      renderHook(() =>
        useEscapeKey({
          onEscape,
          enabled: true,
        })
      );

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      window.dispatchEvent(event);

      expect(onEscape).not.toHaveBeenCalled();

      document.body.removeChild(textarea);
    });

    it('should not trigger when select is focused', () => {
      const onEscape = vi.fn();
      const select = document.createElement('select');
      document.body.appendChild(select);
      select.focus();

      renderHook(() =>
        useEscapeKey({
          onEscape,
          enabled: true,
        })
      );

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      window.dispatchEvent(event);

      expect(onEscape).not.toHaveBeenCalled();

      document.body.removeChild(select);
    });

    it('should not trigger when contenteditable element is focused', () => {
      const onEscape = vi.fn();
      const div = document.createElement('div');
      div.setAttribute('contenteditable', 'true');
      document.body.appendChild(div);
      div.focus();

      renderHook(() =>
        useEscapeKey({
          onEscape,
          enabled: true,
        })
      );

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      window.dispatchEvent(event);

      expect(onEscape).not.toHaveBeenCalled();

      document.body.removeChild(div);
    });

    it('should trigger when non-input element is focused', () => {
      const onEscape = vi.fn();
      const button = document.createElement('button');
      document.body.appendChild(button);
      button.focus();

      renderHook(() =>
        useEscapeKey({
          onEscape,
          enabled: true,
        })
      );

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      window.dispatchEvent(event);

      expect(onEscape).toHaveBeenCalledTimes(1);

      document.body.removeChild(button);
    });
  });

  describe('Dynamic enabling/disabling', () => {
    it('should stop listening when disabled dynamically', () => {
      const onEscape = vi.fn();

      const { rerender } = renderHook(
        ({ enabled }) =>
          useEscapeKey({
            onEscape,
            enabled,
          }),
        { initialProps: { enabled: true } }
      );

      // Disable the hook
      rerender({ enabled: false });

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      window.dispatchEvent(event);

      expect(onEscape).not.toHaveBeenCalled();
    });

    it('should start listening when enabled dynamically', () => {
      const onEscape = vi.fn();

      const { rerender } = renderHook(
        ({ enabled }) =>
          useEscapeKey({
            onEscape,
            enabled,
          }),
        { initialProps: { enabled: false } }
      );

      // Enable the hook
      rerender({ enabled: true });

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      window.dispatchEvent(event);

      expect(onEscape).toHaveBeenCalledTimes(1);
    });
  });

  describe('Callback updates', () => {
    it('should use updated callback', () => {
      const onEscape1 = vi.fn();
      const onEscape2 = vi.fn();

      const { rerender } = renderHook(
        ({ onEscape }) =>
          useEscapeKey({
            onEscape,
            enabled: true,
          }),
        { initialProps: { onEscape: onEscape1 } }
      );

      // Update callback
      rerender({ onEscape: onEscape2 });

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      window.dispatchEvent(event);

      expect(onEscape1).not.toHaveBeenCalled();
      expect(onEscape2).toHaveBeenCalledTimes(1);
    });
  });
});
