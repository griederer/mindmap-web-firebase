/**
 * Animation Throttle and Queue Management
 * Prevents animation conflicts and ensures smooth 60 FPS performance
 */

import Konva from 'konva';

/**
 * Animation configuration
 */
export interface Animation {
  stage: Konva.Stage;
  target: {
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
  };
  duration: number;
  easing: (t: number, b: number, c: number, d: number) => number;
  priority?: number;
}

/**
 * Animation Queue Manager
 * Manages animation execution to prevent race conditions
 */
export class AnimationQueue {
  private currentAnimation: Konva.Tween | null = null;
  private currentPriority: number = 0;

  /**
   * Add animation to queue (cancels current if lower priority)
   * @param animation - Animation configuration
   * @returns Promise that resolves when animation completes
   */
  add(animation: Animation): Promise<void> {
    const priority = animation.priority ?? 0;

    // Cancel current animation if new one has higher priority
    if (this.currentAnimation && priority >= this.currentPriority) {
      this.cancel();
    }

    // If animation with higher priority is running, reject
    if (this.currentAnimation && priority < this.currentPriority) {
      return Promise.reject(new Error('Higher priority animation running'));
    }

    return new Promise((resolve) => {
      this.currentPriority = priority;

      this.currentAnimation = new Konva.Tween({
        node: animation.stage,
        ...animation.target,
        duration: animation.duration,
        easing: animation.easing,
        onFinish: () => {
          this.currentAnimation = null;
          this.currentPriority = 0;
          resolve();
        },
      });

      this.currentAnimation.play();
    });
  }

  /**
   * Cancel currently running animation
   */
  cancel(): void {
    if (this.currentAnimation) {
      this.currentAnimation.destroy();
      this.currentAnimation = null;
      this.currentPriority = 0;
    }
  }

  /**
   * Get current running animation (if any)
   */
  getCurrentAnimation(): Konva.Tween | null {
    return this.currentAnimation;
  }

  /**
   * Check if animation is currently running
   */
  isAnimating(): boolean {
    return this.currentAnimation !== null;
  }
}

/**
 * Create throttled animator that limits updates to specified FPS
 * @param maxFPS - Maximum frames per second (default: 60)
 * @returns Function that throttles animation frame updates
 */
export function createThrottledAnimator(maxFPS: number = 60): (callback: () => void) => void {
  const minFrameTime = 1000 / maxFPS;
  let lastFrameTime = -Infinity; // Ensure first call always executes

  return (callback: () => void) => {
    const now = performance.now();
    const elapsed = now - lastFrameTime;

    if (elapsed >= minFrameTime) {
      lastFrameTime = now;
      callback();
    }
  };
}

/**
 * Debounce auto-focus calls to prevent excessive viewport updates
 * @param callback - Function to debounce
 * @param delay - Delay in milliseconds (default: 100)
 * @returns Debounced function
 */
export function debounceAutoFocus<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 100
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    // Cancel previous pending call
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Schedule new call
    timeoutId = setTimeout(() => {
      callback(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Cancel debounced function (useful for cleanup)
 */
export function cancelDebouncedAutoFocus(_debouncedFn: any): void {
  // Note: This requires storing timeout ID externally
  // For proper cleanup, use the function returned from debounceAutoFocus
  // and call it with a cancellation token
}
