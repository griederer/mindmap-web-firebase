/**
 * ImageUpload Component
 * Allows users to upload images with file picker, preview, and delete functionality
 */

import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { type NodeImage } from '../../types/node';

interface ImageUploadProps {
  images: NodeImage[];
  onChange: (images: NodeImage[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
}

const MAX_IMAGES = 5;
const MAX_SIZE_MB = 2;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ACCEPTED_FORMATS = '.jpg,.jpeg,.png,.gif,.webp';

/**
 * Convert File to base64 data URI
 */
async function convertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ImageUpload({
  images,
  onChange,
  maxImages = MAX_IMAGES,
  maxSizeMB = MAX_SIZE_MB,
}: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);

    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check if adding these files would exceed max limit
    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images per node`);
      return;
    }

    // Process each file
    const newImages: NodeImage[] = [];
    for (const file of files) {
      // Validate file size
      if (file.size > MAX_SIZE_BYTES) {
        setError(`Image too large. Maximum ${maxSizeMB}MB per file.`);
        continue;
      }

      try {
        // Convert to base64
        const base64Data = await convertToBase64(file);

        // Create NodeImage object
        const nodeImage: NodeImage = {
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          data: base64Data,
          filename: file.name,
          size: file.size,
          addedAt: Date.now(),
        };

        newImages.push(nodeImage);
      } catch (err) {
        console.error('Failed to convert image:', err);
        setError('Failed to process image');
      }
    }

    // Update images array
    if (newImages.length > 0) {
      onChange([...images, ...newImages]);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = (imageId: string) => {
    onChange(images.filter((img) => img.id !== imageId));
    setError(null);
  };

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const remainingSlots = maxImages - images.length;
  const canAddMore = remainingSlots > 0;

  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Images ({images.length}/{maxImages})
        </label>
        {error && (
          <span className="text-xs text-red-600 font-medium">{error}</span>
        )}
      </div>

      {/* Thumbnail preview grid */}
      <div className="flex flex-wrap gap-2">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative group"
            style={{ width: '60px', height: '60px' }}
          >
            {/* Thumbnail */}
            <img
              src={image.data}
              alt={image.filename}
              className="w-full h-full object-cover rounded-lg border-2 border-gray-300"
            />

            {/* Delete button */}
            <button
              onClick={() => handleDelete(image.id)}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              aria-label={`Delete ${image.filename}`}
            >
              <X size={12} strokeWidth={3} />
            </button>
          </div>
        ))}

        {/* Add Image button */}
        {canAddMore && (
          <button
            onClick={handleAddClick}
            className="w-[60px] h-[60px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-orange-500 hover:bg-orange-50 transition-colors group"
            aria-label="Add image"
          >
            <Upload
              size={24}
              className="text-gray-400 group-hover:text-orange-500 transition-colors"
            />
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_FORMATS}
        multiple
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload images"
      />

      {/* Helper text */}
      <p className="text-xs text-gray-500">
        Accepted formats: JPG, PNG, GIF, WEBP • Max {maxSizeMB}MB per file
      </p>
    </div>
  );
}
