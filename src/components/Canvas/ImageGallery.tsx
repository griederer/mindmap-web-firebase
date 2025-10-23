/**
 * ImageGallery Component - Konva
 * Displays thumbnail gallery of node images with click handlers
 */

import { useEffect, useState } from 'react';
import { Group, Image as KonvaImage, Text, Rect } from 'react-konva';
import { type NodeImage } from '../../types/node';

interface ImageGalleryProps {
  images: NodeImage[];
  startY: number;
  onImageClick: (index: number) => void;
  panelX: number;
}

const THUMBNAIL_SIZE = 80;
const THUMBNAIL_GAP = 8;
const MAX_VISIBLE = 3;
const PADDING = 16;

export default function ImageGallery({
  images,
  startY,
  onImageClick,
  panelX,
}: ImageGalleryProps) {
  const [loadedImages, setLoadedImages] = useState<Map<string, HTMLImageElement>>(new Map());
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Load images
  useEffect(() => {
    const newLoadedImages = new Map<string, HTMLImageElement>();

    images.forEach((nodeImage) => {
      const img = new window.Image();
      img.src = nodeImage.data;
      img.onload = () => {
        newLoadedImages.set(nodeImage.id, img);
        setLoadedImages(new Map(newLoadedImages));
      };
    });
  }, [images]);

  if (images.length === 0) return null;

  const visibleImages = images.slice(0, MAX_VISIBLE);
  const remainingCount = images.length - MAX_VISIBLE;

  return (
    <Group>
      {/* Render thumbnails */}
      {visibleImages.map((nodeImage, index) => {
        const x = panelX + PADDING + index * (THUMBNAIL_SIZE + THUMBNAIL_GAP);
        const y = startY;
        const img = loadedImages.get(nodeImage.id);
        const isHovered = hoveredIndex === index;

        return (
          <Group key={nodeImage.id}>
            {/* Thumbnail border */}
            <Rect
              x={x}
              y={y}
              width={THUMBNAIL_SIZE}
              height={THUMBNAIL_SIZE}
              stroke="#D1D5DB"
              strokeWidth={2}
              cornerRadius={4}
              fill="white"
            />

            {/* Thumbnail image */}
            {img && (
              <KonvaImage
                x={x}
                y={y}
                width={THUMBNAIL_SIZE}
                height={THUMBNAIL_SIZE}
                image={img}
                cornerRadius={4}
                onClick={() => onImageClick(index)}
                onTap={() => onImageClick(index)}
                onMouseEnter={() => {
                  document.body.style.cursor = 'pointer';
                  setHoveredIndex(index);
                }}
                onMouseLeave={() => {
                  document.body.style.cursor = 'default';
                  setHoveredIndex(null);
                }}
                scaleX={isHovered ? 1.05 : 1}
                scaleY={isHovered ? 1.05 : 1}
                offsetX={isHovered ? THUMBNAIL_SIZE * 0.025 : 0}
                offsetY={isHovered ? THUMBNAIL_SIZE * 0.025 : 0}
                shadowColor={isHovered ? 'rgba(0, 0, 0, 0.3)' : undefined}
                shadowBlur={isHovered ? 10 : 0}
                shadowOffsetY={isHovered ? 4 : 0}
                shadowEnabled={isHovered}
              />
            )}
          </Group>
        );
      })}

      {/* "+N more" badge if there are remaining images */}
      {remainingCount > 0 && (
        <Group>
          <Rect
            x={panelX + PADDING + MAX_VISIBLE * (THUMBNAIL_SIZE + THUMBNAIL_GAP)}
            y={startY + THUMBNAIL_SIZE / 2 - 15}
            width={60}
            height={30}
            fill="#F97316"
            cornerRadius={15}
          />
          <Text
            x={panelX + PADDING + MAX_VISIBLE * (THUMBNAIL_SIZE + THUMBNAIL_GAP)}
            y={startY + THUMBNAIL_SIZE / 2 - 15}
            width={60}
            height={30}
            text={`+${remainingCount}`}
            fontSize={14}
            fontFamily="system-ui, -apple-system, sans-serif"
            fontStyle="bold"
            fill="white"
            align="center"
            verticalAlign="middle"
          />
        </Group>
      )}
    </Group>
  );
}

/**
 * Calculate the height required for the gallery
 */
export function getGalleryHeight(imageCount: number): number {
  if (imageCount === 0) return 0;
  return THUMBNAIL_SIZE + THUMBNAIL_GAP * 2;
}
