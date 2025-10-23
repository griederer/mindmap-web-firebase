/**
 * ImageViewer Component Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageViewer from './ImageViewer';
import { type NodeImage } from '../../types/node';

describe('ImageViewer', () => {
  const mockImages: NodeImage[] = [
    {
      id: 'img-1',
      data: 'data:image/png;base64,iVBORw0KGgoAAAANS',
      filename: 'image1.png',
      size: 1024,
      addedAt: Date.now(),
    },
    {
      id: 'img-2',
      data: 'data:image/jpeg;base64,/9j/4AAQSkZJ',
      filename: 'image2.jpg',
      size: 2048,
      addedAt: Date.now(),
    },
    {
      id: 'img-3',
      data: 'data:image/gif;base64,R0lGODlhA',
      filename: 'image3.gif',
      size: 512,
      addedAt: Date.now(),
    },
  ];

  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('should not render when isOpen is false', () => {
    const { container } = render(
      <ImageViewer
        images={mockImages}
        initialIndex={0}
        isOpen={false}
        onClose={mockOnClose}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render when isOpen is true', () => {
    render(
      <ImageViewer
        images={mockImages}
        initialIndex={0}
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    const image = screen.getByAltText('image1.png');
    expect(image).toBeDefined();
  });

  it('should display the correct initial image', () => {
    render(
      <ImageViewer
        images={mockImages}
        initialIndex={1}
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    const image = screen.getByAltText('image2.jpg');
    expect(image).toBeDefined();
    expect(image.getAttribute('src')).toBe(mockImages[1].data);
  });

  it('should display image counter', () => {
    render(
      <ImageViewer
        images={mockImages}
        initialIndex={0}
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    expect(screen.getByText('1 / 3')).toBeDefined();
  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ImageViewer
        images={mockImages}
        initialIndex={0}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    const closeButton = screen.getByTitle('Close (ESC)');
    await user.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when backdrop is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ImageViewer
        images={mockImages}
        initialIndex={0}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    // Click the backdrop (the outermost div)
    const backdrop = container.firstChild as HTMLElement;
    await user.click(backdrop);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onClose when clicking on image', async () => {
    const user = userEvent.setup();
    render(
      <ImageViewer
        images={mockImages}
        initialIndex={0}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    const image = screen.getByAltText('image1.png');
    await user.click(image);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should show navigation arrows when multiple images', () => {
    render(
      <ImageViewer
        images={mockImages}
        initialIndex={0}
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    expect(screen.getByTitle('Previous (←)')).toBeDefined();
    expect(screen.getByTitle('Next (→)')).toBeDefined();
  });

  it('should not show navigation arrows when single image', () => {
    render(
      <ImageViewer
        images={[mockImages[0]]}
        initialIndex={0}
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    expect(screen.queryByTitle('Previous (←)')).toBeNull();
    expect(screen.queryByTitle('Next (→)')).toBeNull();
  });

  it('should navigate to next image when next button clicked', async () => {
    const user = userEvent.setup();
    render(
      <ImageViewer
        images={mockImages}
        initialIndex={0}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('1 / 3')).toBeDefined();

    const nextButton = screen.getByTitle('Next (→)');
    await user.click(nextButton);

    expect(screen.getByText('2 / 3')).toBeDefined();
    expect(screen.getByAltText('image2.jpg')).toBeDefined();
  });

  it('should navigate to previous image when previous button clicked', async () => {
    const user = userEvent.setup();
    render(
      <ImageViewer
        images={mockImages}
        initialIndex={1}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('2 / 3')).toBeDefined();

    const prevButton = screen.getByTitle('Previous (←)');
    await user.click(prevButton);

    expect(screen.getByText('1 / 3')).toBeDefined();
    expect(screen.getByAltText('image1.png')).toBeDefined();
  });

  it('should wrap to last image when navigating previous from first', async () => {
    const user = userEvent.setup();
    render(
      <ImageViewer
        images={mockImages}
        initialIndex={0}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    const prevButton = screen.getByTitle('Previous (←)');
    await user.click(prevButton);

    expect(screen.getByText('3 / 3')).toBeDefined();
    expect(screen.getByAltText('image3.gif')).toBeDefined();
  });

  it('should wrap to first image when navigating next from last', async () => {
    const user = userEvent.setup();
    render(
      <ImageViewer
        images={mockImages}
        initialIndex={2}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    const nextButton = screen.getByTitle('Next (→)');
    await user.click(nextButton);

    expect(screen.getByText('1 / 3')).toBeDefined();
    expect(screen.getByAltText('image1.png')).toBeDefined();
  });

  it('should close when ESC key is pressed', async () => {
    const user = userEvent.setup();
    render(
      <ImageViewer
        images={mockImages}
        initialIndex={0}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    await user.keyboard('{Escape}');
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should navigate to next image when right arrow key is pressed', async () => {
    const user = userEvent.setup();
    render(
      <ImageViewer
        images={mockImages}
        initialIndex={0}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('1 / 3')).toBeDefined();

    await user.keyboard('{ArrowRight}');

    expect(screen.getByText('2 / 3')).toBeDefined();
  });

  it('should navigate to previous image when left arrow key is pressed', async () => {
    const user = userEvent.setup();
    render(
      <ImageViewer
        images={mockImages}
        initialIndex={1}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('2 / 3')).toBeDefined();

    await user.keyboard('{ArrowLeft}');

    expect(screen.getByText('1 / 3')).toBeDefined();
  });

  it('should update current image when initialIndex prop changes', () => {
    const { rerender } = render(
      <ImageViewer
        images={mockImages}
        initialIndex={0}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByAltText('image1.png')).toBeDefined();

    rerender(
      <ImageViewer
        images={mockImages}
        initialIndex={2}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByAltText('image3.gif')).toBeDefined();
  });

  it('should not render when images array is empty', () => {
    const { container } = render(
      <ImageViewer
        images={[]}
        initialIndex={0}
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should handle rapid keyboard navigation', async () => {
    const user = userEvent.setup();
    render(
      <ImageViewer
        images={mockImages}
        initialIndex={0}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    // Navigate forward multiple times
    await user.keyboard('{ArrowRight}');
    await user.keyboard('{ArrowRight}');
    await user.keyboard('{ArrowRight}'); // Should wrap to first

    expect(screen.getByText('1 / 3')).toBeDefined();
    expect(screen.getByAltText('image1.png')).toBeDefined();
  });
});
