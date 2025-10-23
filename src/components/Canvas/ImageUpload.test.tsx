import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageUpload from './ImageUpload';
import { type NodeImage } from '../../types/node';

describe('ImageUpload', () => {
  const mockOnChange = vi.fn();

  const createMockFile = (name: string, size: number, type: string): File => {
    const blob = new Blob(['x'.repeat(size)], { type });
    return new File([blob], name, { type });
  };

  const mockImages: NodeImage[] = [
    {
      id: 'img-1',
      data: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
      filename: 'test1.jpg',
      size: 100000,
      addedAt: 1729554100000,
    },
    {
      id: 'img-2',
      data: 'data:image/png;base64,iVBORw0KGgo...',
      filename: 'test2.png',
      size: 150000,
      addedAt: 1729554200000,
    },
  ];

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with correct image count', () => {
    render(<ImageUpload images={mockImages} onChange={mockOnChange} />);
    expect(screen.getByText(/Images \(2\/5\)/i)).toBeInTheDocument();
  });

  it('renders thumbnails for existing images', () => {
    render(<ImageUpload images={mockImages} onChange={mockOnChange} />);

    const thumbnails = screen.getAllByRole('img');
    expect(thumbnails).toHaveLength(2);
    expect(thumbnails[0]).toHaveAttribute('alt', 'test1.jpg');
    expect(thumbnails[1]).toHaveAttribute('alt', 'test2.png');
  });

  it('shows add button when under max limit', () => {
    render(<ImageUpload images={mockImages} onChange={mockOnChange} />);

    const addButton = screen.getByLabelText(/add image/i);
    expect(addButton).toBeInTheDocument();
  });

  it('hides add button when at max limit', () => {
    const maxImages: NodeImage[] = Array.from({ length: 5 }, (_, i) => ({
      id: `img-${i}`,
      data: `data:image/jpeg;base64,abc${i}`,
      filename: `test${i}.jpg`,
      size: 100000,
      addedAt: Date.now(),
    }));

    render(<ImageUpload images={maxImages} onChange={mockOnChange} />);

    const addButton = screen.queryByLabelText(/add image/i);
    expect(addButton).not.toBeInTheDocument();
  });

  it('displays helper text with format and size info', () => {
    render(<ImageUpload images={[]} onChange={mockOnChange} />);

    expect(
      screen.getByText(/Accepted formats: JPG, PNG, GIF, WEBP/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Max 2MB per file/i)).toBeInTheDocument();
  });

  it('calls onChange when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<ImageUpload images={mockImages} onChange={mockOnChange} />);

    // Hover to show delete button
    const firstThumbnail = screen.getByAltText('test1.jpg').parentElement!;
    await user.hover(firstThumbnail);

    // Click delete button
    const deleteButton = screen.getByLabelText(/delete test1.jpg/i);
    await user.click(deleteButton);

    expect(mockOnChange).toHaveBeenCalledWith([mockImages[1]]);
  });

  it('shows error when trying to exceed max images', async () => {
    const fourImages = mockImages.concat([
      {
        id: 'img-3',
        data: 'data:image/jpeg;base64,abc3',
        filename: 'test3.jpg',
        size: 100000,
        addedAt: Date.now(),
      },
      {
        id: 'img-4',
        data: 'data:image/jpeg;base64,abc4',
        filename: 'test4.jpg',
        size: 100000,
        addedAt: Date.now(),
      },
    ]);

    const user = userEvent.setup();
    render(<ImageUpload images={fourImages} onChange={mockOnChange} />);

    const addButton = screen.getByLabelText(/add image/i);
    await user.click(addButton);

    const fileInput = screen.getByLabelText(/upload images/i);

    // Try to upload 2 files (would exceed max of 5)
    const files = [
      createMockFile('test5.jpg', 100000, 'image/jpeg'),
      createMockFile('test6.jpg', 100000, 'image/jpeg'),
    ];

    await user.upload(fileInput as HTMLInputElement, files);

    await waitFor(() => {
      expect(screen.getByText(/Maximum 5 images per node/i)).toBeInTheDocument();
    });
  });

  it('shows error for oversized files', async () => {
    const user = userEvent.setup();
    render(<ImageUpload images={[]} onChange={mockOnChange} />);

    const addButton = screen.getByLabelText(/add image/i);
    await user.click(addButton);

    const fileInput = screen.getByLabelText(/upload images/i);

    // Create file larger than 2MB
    const largeFile = createMockFile('large.jpg', 3 * 1024 * 1024, 'image/jpeg');

    await user.upload(fileInput as HTMLInputElement, largeFile);

    await waitFor(() => {
      expect(
        screen.getByText(/Image too large. Maximum 2MB per file./i)
      ).toBeInTheDocument();
    });
  });

  it('clears error when deleting an image', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <ImageUpload images={mockImages} onChange={mockOnChange} />
    );

    // Trigger an error first
    const addButton = screen.getByLabelText(/add image/i);
    await user.click(addButton);

    const fileInput = screen.getByLabelText(/upload images/i);
    const largeFile = createMockFile('large.jpg', 3 * 1024 * 1024, 'image/jpeg');
    await user.upload(fileInput as HTMLInputElement, largeFile);

    await waitFor(() => {
      expect(screen.getByText(/Image too large/i)).toBeInTheDocument();
    });

    // Now delete an image
    const firstThumbnail = screen.getByAltText('test1.jpg').parentElement!;
    await user.hover(firstThumbnail);

    const deleteButton = screen.getByLabelText(/delete test1.jpg/i);
    await user.click(deleteButton);

    // Re-render with updated images to reflect deletion
    rerender(<ImageUpload images={[mockImages[1]]} onChange={mockOnChange} />);

    // Error should be cleared
    expect(screen.queryByText(/Image too large/i)).not.toBeInTheDocument();
  });

  it('accepts multiple file formats', () => {
    render(<ImageUpload images={[]} onChange={mockOnChange} />);

    const fileInput = screen.getByLabelText(/upload images/i) as HTMLInputElement;

    expect(fileInput.accept).toBe('.jpg,.jpeg,.png,.gif,.webp');
    expect(fileInput.multiple).toBe(true);
  });

  it('uses custom maxImages prop', () => {
    render(
      <ImageUpload images={mockImages} onChange={mockOnChange} maxImages={3} />
    );

    expect(screen.getByText(/Images \(2\/3\)/i)).toBeInTheDocument();
  });

  it('uses custom maxSizeMB prop', () => {
    render(
      <ImageUpload images={[]} onChange={mockOnChange} maxSizeMB={5} />
    );

    expect(screen.getByText(/Max 5MB per file/i)).toBeInTheDocument();
  });
});
