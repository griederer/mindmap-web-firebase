/**
 * Tests for Animation Progress Indicator
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useViewportStore } from '../../stores/viewportStore';
import AnimationIndicator from './AnimationIndicator';

describe('AnimationIndicator', () => {
  beforeEach(() => {
    // Reset viewport store state
    useViewportStore.setState({
      animationInProgress: false,
    });
  });

  it('should not render when animation is not in progress', () => {
    useViewportStore.setState({ animationInProgress: false });

    const { container } = render(<AnimationIndicator />);

    expect(container.firstChild).toBeNull();
  });

  it('should render when animation is in progress', () => {
    useViewportStore.setState({ animationInProgress: true });

    render(<AnimationIndicator />);

    expect(screen.getByText('Animating...')).toBeInTheDocument();
  });

  it('should have pulse animation class', () => {
    useViewportStore.setState({ animationInProgress: true });

    render(<AnimationIndicator />);

    const container = screen.getByText('Animating...').parentElement;
    expect(container).toHaveClass('animate-pulse');
  });

  it('should have bounce animation on indicator dot', () => {
    useViewportStore.setState({ animationInProgress: true });

    const { container } = render(<AnimationIndicator />);

    const dot = container.querySelector('.animate-bounce');
    expect(dot).toBeInTheDocument();
  });

  it('should be positioned at top center', () => {
    useViewportStore.setState({ animationInProgress: true });

    const { container } = render(<AnimationIndicator />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('top-4', 'left-1/2', 'transform', '-translate-x-1/2');
  });

  it('should not intercept pointer events', () => {
    useViewportStore.setState({ animationInProgress: true });

    const { container } = render(<AnimationIndicator />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('pointer-events-none');
  });
});
