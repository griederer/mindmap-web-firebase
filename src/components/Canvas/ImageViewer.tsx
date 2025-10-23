/**
 * ImageViewer Component
 * Fullscreen image viewer with keyboard navigation
 */

import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { type NodeImage } from '../../types/node';

interface ImageViewerProps {
  images: NodeImage[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageViewer({
  images,
  initialIndex,
  isOpen,
  onClose,
}: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Update current index when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Keyboard handlers
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, images.length]);

  // Navigate to previous image
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  // Navigate to next image
  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  // Click outside image to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black bg-opacity-95 flex items-center justify-center animate-fade-in"
      onClick={handleBackdropClick}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
        title="Close (ESC)"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Previous button - only show if multiple images */}
      {images.length > 1 && (
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          title="Previous (←)"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {/* Next button - only show if multiple images */}
      {images.length > 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          title="Next (→)"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

      {/* Image */}
      <img
        src={currentImage.data}
        alt={currentImage.filename}
        className="max-w-[90vw] max-h-[90vh] object-contain"
      />

      {/* Counter */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-black bg-opacity-70 text-white rounded-lg">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
