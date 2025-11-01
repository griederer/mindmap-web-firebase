/**
 * Tests for Animation Throttle and Queue Management
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Konva from 'konva';
import {
  AnimationQueue,
  createThrottledAnimator,
  debounceAutoFocus,
  Animation,
} from './animationThrottle';

describe('AnimationQueue', () => {
  let queue: AnimationQueue;
  let mockStage: Konva.Stage;

  beforeEach(() => {
    queue = new AnimationQueue();

    // Mock Konva.Stage
    mockStage = {
      x: vi.fn().mockReturnValue(0),
      y: vi.fn().mockReturnValue(0),
      scaleX: vi.fn().mockReturnValue(1),
      scaleY: vi.fn().mockReturnValue(1),
    } as unknown as Konva.Stage;

    // Mock Konva.Tween to execute immediately
    vi.spyOn(Konva, 'Tween').mockImplementation((config: any) => {
      // Execute onFinish immediately for testing
      setTimeout(() => {
        if (config.onFinish) {
          config.onFinish();
        }
      }, 0);

      return {
        play: vi.fn(),
        destroy: vi.fn(),
      } as any;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should add animation and return promise', async () => {
    const animation: Animation = {
      stage: mockStage,
      target: { x: 100, y: 200, scaleX: 1.5, scaleY: 1.5 },
      duration: 0.4,
      easing: Konva.Easings.EaseOut,
    };

    const promise = queue.add(animation);
    expect(promise).toBeInstanceOf(Promise);

    await promise;
    expect(Konva.Tween).toHaveBeenCalledWith(
      expect.objectContaining({
        node: mockStage,
        x: 100,
        y: 200,
        scaleX: 1.5,
        scaleY: 1.5,
        duration: 0.4,
        easing: Konva.Easings.EaseOut,
      })
    );
  });

  it('should cancel current animation when adding higher priority animation', async () => {
    const lowPriorityAnimation: Animation = {
      stage: mockStage,
      target: { x: 100, y: 200, scaleX: 1.5, scaleY: 1.5 },
      duration: 0.4,
      easing: Konva.Easings.EaseOut,
      priority: 1,
    };

    const highPriorityAnimation: Animation = {
      stage: mockStage,
      target: { x: 200, y: 300, scaleX: 2.0, scaleY: 2.0 },
      duration: 0.4,
      easing: Konva.Easings.EaseOut,
      priority: 2,
    };

    queue.add(lowPriorityAnimation);
    expect(queue.isAnimating()).toBe(true);

    await queue.add(highPriorityAnimation);

    // High priority animation should have replaced low priority
    expect(Konva.Tween).toHaveBeenCalledTimes(2);
  });

  it('should reject when adding lower priority animation', async () => {
    const highPriorityAnimation: Animation = {
      stage: mockStage,
      target: { x: 100, y: 200, scaleX: 1.5, scaleY: 1.5 },
      duration: 0.4,
      easing: Konva.Easings.EaseOut,
      priority: 2,
    };

    const lowPriorityAnimation: Animation = {
      stage: mockStage,
      target: { x: 200, y: 300, scaleX: 2.0, scaleY: 2.0 },
      duration: 0.4,
      easing: Konva.Easings.EaseOut,
      priority: 1,
    };

    queue.add(highPriorityAnimation);

    await expect(queue.add(lowPriorityAnimation)).rejects.toThrow(
      'Higher priority animation running'
    );
  });

  it('should track current animation status', () => {
    expect(queue.isAnimating()).toBe(false);
    expect(queue.getCurrentAnimation()).toBeNull();

    const animation: Animation = {
      stage: mockStage,
      target: { x: 100, y: 200, scaleX: 1.5, scaleY: 1.5 },
      duration: 0.4,
      easing: Konva.Easings.EaseOut,
    };

    queue.add(animation);
    expect(queue.isAnimating()).toBe(true);
    expect(queue.getCurrentAnimation()).not.toBeNull();
  });

  it('should cancel current animation', () => {
    const animation: Animation = {
      stage: mockStage,
      target: { x: 100, y: 200, scaleX: 1.5, scaleY: 1.5 },
      duration: 0.4,
      easing: Konva.Easings.EaseOut,
    };

    queue.add(animation);
    expect(queue.isAnimating()).toBe(true);

    queue.cancel();
    expect(queue.isAnimating()).toBe(false);
    expect(queue.getCurrentAnimation()).toBeNull();
  });

  it('should resolve promise when animation completes', async () => {
    const animation: Animation = {
      stage: mockStage,
      target: { x: 100, y: 200, scaleX: 1.5, scaleY: 1.5 },
      duration: 0.4,
      easing: Konva.Easings.EaseOut,
    };

    const promise = queue.add(animation);
    await expect(promise).resolves.toBeUndefined();
  });

  it('should handle default priority of 0', async () => {
    const animation: Animation = {
      stage: mockStage,
      target: { x: 100, y: 200, scaleX: 1.5, scaleY: 1.5 },
      duration: 0.4,
      easing: Konva.Easings.EaseOut,
      // No priority specified (defaults to 0)
    };

    await queue.add(animation);

    // Should work without priority specified
    expect(Konva.Tween).toHaveBeenCalled();
  });
});

describe('createThrottledAnimator', () => {
  let performanceNowSpy: any;
  let currentTime: number;

  beforeEach(() => {
    currentTime = 0;
    performanceNowSpy = vi.spyOn(performance, 'now').mockImplementation(() => currentTime);
  });

  afterEach(() => {
    performanceNowSpy.mockRestore();
  });

  it('should throttle function calls to specified FPS', () => {
    const callback = vi.fn();
    const throttledAnimator = createThrottledAnimator(60); // 60 FPS = 16.67ms per frame

    // First call should execute immediately
    throttledAnimator(callback);
    expect(callback).toHaveBeenCalledTimes(1);

    // Call rapidly without time passing (should be throttled)
    for (let i = 0; i < 10; i++) {
      currentTime += 1; // 1ms intervals (much faster than 16.67ms frame rate)
      throttledAnimator(callback);
    }

    // Should still be 1 due to throttling (only 10ms total elapsed, less than 16.67ms)
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should execute callback when enough time has elapsed', () => {
    const callback = vi.fn();
    const throttledAnimator = createThrottledAnimator(60);

    throttledAnimator(callback);
    expect(callback).toHaveBeenCalledTimes(1);

    // Wait for next frame (17ms for 60 FPS)
    currentTime += 17;

    throttledAnimator(callback);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should support custom FPS limits', () => {
    const callback = vi.fn();
    const throttledAnimator = createThrottledAnimator(30); // 30 FPS = 33.33ms per frame

    throttledAnimator(callback);
    expect(callback).toHaveBeenCalledTimes(1);

    // Wait 20ms (not enough for 30 FPS)
    currentTime += 20;
    throttledAnimator(callback);
    expect(callback).toHaveBeenCalledTimes(1);

    // Wait another 15ms (total 35ms, enough for 30 FPS)
    currentTime += 15;
    throttledAnimator(callback);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should default to 60 FPS if no parameter provided', () => {
    const callback = vi.fn();
    const throttledAnimator = createThrottledAnimator();

    throttledAnimator(callback);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('debounceAutoFocus', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should debounce function calls', () => {
    const callback = vi.fn();
    const debounced = debounceAutoFocus(callback, 100);

    // Call multiple times rapidly
    debounced('arg1');
    debounced('arg2');
    debounced('arg3');

    // Should not have executed yet
    expect(callback).not.toHaveBeenCalled();

    // Fast-forward time
    vi.advanceTimersByTime(100);

    // Should execute once with last arguments
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('arg3');
  });

  it('should cancel previous pending calls', () => {
    const callback = vi.fn();
    const debounced = debounceAutoFocus(callback, 100);

    debounced('first');
    vi.advanceTimersByTime(50); // Half the delay

    debounced('second'); // This should cancel 'first'

    vi.advanceTimersByTime(50); // Not enough for 'second'
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50); // Now enough for 'second'
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('second');
  });

  it('should support custom delay', () => {
    const callback = vi.fn();
    const debounced = debounceAutoFocus(callback, 200);

    debounced();

    vi.advanceTimersByTime(100);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should default to 100ms delay if not specified', () => {
    const callback = vi.fn();
    const debounced = debounceAutoFocus(callback);

    debounced();

    vi.advanceTimersByTime(99);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple arguments correctly', () => {
    const callback = vi.fn();
    const debounced = debounceAutoFocus(callback, 100);

    debounced(1, 'hello', { key: 'value' });

    vi.advanceTimersByTime(100);

    expect(callback).toHaveBeenCalledWith(1, 'hello', { key: 'value' });
  });
});
