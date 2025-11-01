/**
 * Hook for handling Escape key press to close panels and modals
 * Provides centralized ESC key handling across the application
 */

import { useEffect } from 'react';

interface UseEscapeKeyOptions {
  /** Callback function to execute when Escape is pressed */
  onEscape: () => void;
  /** Whether the hook should listen for Escape key (default: true) */
  enabled?: boolean;
}

/**
 * Custom hook for ESC key handling
 *
 * Features:
 * - Listens for Escape key press when enabled
 * - Prevents triggering when input fields are focused
 * - Auto-cleanup on unmount
 * - Supports enabling/disabling dynamically
 *
 * @param options - Configuration options for the hook
 *
 * @example
 * ```tsx
 * useEscapeKey({
 *   onEscape: () => closeModal(),
 *   enabled: isModalOpen,
 * });
 * ```
 */
export function useEscapeKey({ onEscape, enabled = true }: UseEscapeKeyOptions): void {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle Escape key
      if (event.key !== 'Escape') return;

      // Don't trigger if user is typing in an input field
      const activeElement = document.activeElement;
      if (
        activeElement &&
        (activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.tagName === 'SELECT' ||
          activeElement.getAttribute('contenteditable') === 'true')
      ) {
        return;
      }

      // Execute callback
      onEscape();
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup on unmount or when dependencies change
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onEscape, enabled]);
}
