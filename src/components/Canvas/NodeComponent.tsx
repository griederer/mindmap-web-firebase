/**
 * Node Component - Konva v3.0
 * Renders individual mind map node with multiple style options
 * Supports: boxed, text, bubble, minimal styles + image thumbnails
 */

import { useEffect, useRef, useCallback, memo } from 'react';
import { Group, Rect, Text, Circle, Image as KonvaImage } from 'react-konva';
import { Node, NodeStyle } from '../../types/node';
import { useProjectStore } from '../../stores/projectStore';
import { useUIStore } from '../../stores/uiStore';
import Konva from 'konva';
import useImage from 'use-image';

interface NodeComponentProps {
  node: Node;
  isSelected: boolean;
  isFocused: boolean;
  isBlurred: boolean;
}

const NODE_WIDTH = 200;
const NODE_HEIGHT = 60;
const NODE_PADDING = 12;
const EXPAND_BUTTON_RADIUS = 8;
const IMAGE_THUMBNAIL_SIZE = 24;

// Image thumbnail component
function ImageThumbnail({ imageData, x, y, size }: { imageData: string; x: number; y: number; size: number }) {
  const [image] = useImage(imageData);

  if (!image) return null;

  return (
    <KonvaImage
      x={x}
      y={y}
      width={size}
      height={size}
      image={image}
      cornerRadius={4}
    />
  );
}

function NodeComponentInner({ node, isSelected, isFocused, isBlurred }: NodeComponentProps) {
  const toggleNodeExpansion = useProjectStore((state) => state.toggleNodeExpansion);
  const selectNode = useUIStore((state) => state.selectNode);
  const groupRef = useRef<Konva.Group>(null);

  const hasChildren = node.children.length > 0;
  const hasImages = node.images && node.images.length > 0;
  const nodeStyle: NodeStyle = node.style || 'boxed';
  const branchColor = node.branchColor || '#fb923c';

  // Animate node appearance on mount with smooth fade
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.to({
        opacity: 1,
        scaleX: 1,
        scaleY: 1,
        duration: 1.2,
        easing: Konva.Easings.EaseOut,
      });
    }
  }, []);

  // Animate position changes with smooth easing
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.to({
        x: node.position.x,
        y: node.position.y,
        duration: 0.6,
        easing: Konva.Easings.EaseInOut,
      });
    }
  }, [node.position.x, node.position.y]);

  // Animate visibility changes (appear/disappear smoothly)
  useEffect(() => {
    if (groupRef.current) {
      if (node.isVisible) {
        // Fade in when becoming visible
        const targetOpacity = isBlurred ? 0.3 : 1;
        groupRef.current.to({
          opacity: targetOpacity,
          scaleX: 1,
          scaleY: 1,
          duration: 1.2, // Smooth 1.2s fade in
          easing: Konva.Easings.EaseOut,
        });
      } else {
        // Fade out when becoming invisible
        groupRef.current.to({
          opacity: 0,
          scaleX: 0.95,
          scaleY: 0.95,
          duration: 1.0, // Smooth 1.0s fade out
          easing: Konva.Easings.EaseIn,
        });
      }
    }
  }, [node.isVisible, isBlurred]);

  // Animate focus/blur transitions
  useEffect(() => {
    if (groupRef.current && node.isVisible) {
      const targetOpacity = isBlurred ? 0.3 : 1;
      groupRef.current.to({
        opacity: targetOpacity,
        duration: 0.5,
        easing: Konva.Easings.EaseInOut,
      });
    }
  }, [isBlurred, node.isVisible]);

  const handleClick = useCallback(() => {
    selectNode(node.id);
  }, [selectNode, node.id]);

  const handleExpandClick = useCallback((e: any) => {
    e.cancelBubble = true; // Prevent node selection
    toggleNodeExpansion(node.id);
  }, [toggleNodeExpansion, node.id]);

  // Render different node styles
  const renderNodeStyle = () => {
    switch (nodeStyle) {
      case 'text':
        // Text-only: No background, just the title with branch color
        return (
          <>
            {/* Invisible hit area for clicks */}
            <Rect
              width={NODE_WIDTH}
              height={NODE_HEIGHT}
              fill="transparent"
            />
            {/* Subtle underline accent */}
            <Rect
              x={NODE_PADDING}
              y={NODE_HEIGHT - 8}
              width={NODE_WIDTH - NODE_PADDING * 2 - (hasChildren ? 30 : 0)}
              height={2}
              fill={branchColor}
              opacity={0.5}
              cornerRadius={1}
            />
          </>
        );

      case 'bubble':
        // Bubble: Pill-shaped with branch color background
        return (
          <Rect
            width={NODE_WIDTH}
            height={NODE_HEIGHT}
            fill={branchColor}
            cornerRadius={NODE_HEIGHT / 2}
            shadowColor="rgba(0, 0, 0, 0.15)"
            shadowBlur={10}
            shadowOffsetY={2}
            stroke={isSelected ? '#1f2937' : 'transparent'}
            strokeWidth={isSelected ? 2 : 0}
          />
        );

      case 'minimal':
        // Minimal: Light background, no border, subtle shadow
        return (
          <Rect
            width={NODE_WIDTH}
            height={NODE_HEIGHT}
            fill="#f9fafb"
            cornerRadius={8}
            shadowColor="rgba(0, 0, 0, 0.05)"
            shadowBlur={6}
            shadowOffsetY={1}
            stroke={isSelected ? branchColor : 'transparent'}
            strokeWidth={isSelected ? 1.5 : 0}
          />
        );

      case 'boxed':
      default:
        // Boxed: White background, border, shadow (original style)
        return (
          <>
            {/* Glow effect for focused node */}
            {isFocused && (
              <Rect
                width={NODE_WIDTH + 16}
                height={NODE_HEIGHT + 16}
                x={-8}
                y={-8}
                fill="transparent"
                cornerRadius={12}
                shadowColor={branchColor}
                shadowBlur={25}
                shadowOpacity={0.6}
                shadowEnabled={true}
              />
            )}
            <Rect
              width={NODE_WIDTH}
              height={NODE_HEIGHT}
              fill="white"
              cornerRadius={8}
              shadowColor={isFocused ? `${branchColor}4D` : 'rgba(0, 0, 0, 0.1)'}
              shadowBlur={isFocused ? 20 : 10}
              shadowOffsetY={isFocused ? 4 : 2}
              stroke={isSelected ? branchColor : (isFocused ? branchColor : '#e5e7eb')}
              strokeWidth={isSelected || isFocused ? 2 : 1}
            />
          </>
        );
    }
  };

  // Get text color based on style
  const getTextColor = () => {
    switch (nodeStyle) {
      case 'bubble':
        return '#ffffff';
      case 'text':
        return branchColor;
      default:
        return '#1f2937';
    }
  };

  // Calculate text width accounting for images and expand button
  const getTextWidth = () => {
    let width = NODE_WIDTH - NODE_PADDING * 2;
    if (hasChildren) width -= 30;
    if (hasImages && nodeStyle !== 'text') width -= IMAGE_THUMBNAIL_SIZE + 8;
    return width;
  };

  return (
    <Group
      ref={groupRef}
      x={node.position.x}
      y={node.position.y}
      opacity={isBlurred ? 0.3 : 0}
      scaleX={0.95}
      scaleY={0.95}
      onClick={handleClick}
    >
      {/* Node background based on style */}
      {renderNodeStyle()}

      {/* Image thumbnail (if present and not text style) */}
      {hasImages && nodeStyle !== 'text' && node.images && (
        <ImageThumbnail
          imageData={node.images[0].data}
          x={NODE_PADDING}
          y={(NODE_HEIGHT - IMAGE_THUMBNAIL_SIZE) / 2}
          size={IMAGE_THUMBNAIL_SIZE}
        />
      )}

      {/* Node title */}
      <Text
        x={hasImages && nodeStyle !== 'text' ? NODE_PADDING + IMAGE_THUMBNAIL_SIZE + 8 : NODE_PADDING}
        y={NODE_PADDING}
        width={getTextWidth()}
        height={NODE_HEIGHT - NODE_PADDING * 2}
        text={node.title}
        fontSize={nodeStyle === 'bubble' ? 13 : 14}
        fontFamily="system-ui, -apple-system, sans-serif"
        fontStyle={nodeStyle === 'text' ? 'bold' : 'normal'}
        fill={getTextColor()}
        verticalAlign="middle"
        wrap="word"
        ellipsis={true}
      />

      {/* Branch color indicator (left edge) for boxed and minimal */}
      {(nodeStyle === 'boxed' || nodeStyle === 'minimal') && node.level > 0 && (
        <Rect
          x={0}
          y={12}
          width={3}
          height={NODE_HEIGHT - 24}
          fill={branchColor}
          cornerRadius={[0, 2, 2, 0]}
        />
      )}

      {/* Expand/collapse button */}
      {hasChildren && (
        <Group
          x={NODE_WIDTH - 24}
          y={NODE_HEIGHT / 2}
          onClick={handleExpandClick}
        >
          {/* Button background */}
          <Circle
            radius={EXPAND_BUTTON_RADIUS}
            fill={node.isExpanded ? branchColor : '#f3f4f6'}
            stroke={node.isExpanded ? branchColor : '#d1d5db'}
            strokeWidth={1}
          />

          {/* Plus/minus icon */}
          <Text
            x={-EXPAND_BUTTON_RADIUS}
            y={-EXPAND_BUTTON_RADIUS}
            width={EXPAND_BUTTON_RADIUS * 2}
            height={EXPAND_BUTTON_RADIUS * 2}
            text={node.isExpanded ? '−' : '+'}
            fontSize={12}
            fontFamily="system-ui"
            fill={node.isExpanded ? 'white' : '#6b7280'}
            align="center"
            verticalAlign="middle"
          />
        </Group>
      )}

      {/* Image count badge (if multiple images) */}
      {hasImages && node.images && node.images.length > 1 && (
        <Group x={NODE_PADDING + IMAGE_THUMBNAIL_SIZE - 6} y={(NODE_HEIGHT - IMAGE_THUMBNAIL_SIZE) / 2 - 4}>
          <Circle
            radius={8}
            fill={branchColor}
          />
          <Text
            x={-8}
            y={-8}
            width={16}
            height={16}
            text={String(node.images.length)}
            fontSize={9}
            fontFamily="system-ui"
            fill="white"
            align="center"
            verticalAlign="middle"
          />
        </Group>
      )}

      {/* Level indicator (optional debug, hidden by default) */}
      {false && node.level > 0 && (
        <Text
          x={NODE_PADDING}
          y={NODE_HEIGHT - 18}
          text={`L${node.level}`}
          fontSize={10}
          fontFamily="monospace"
          fill="#9ca3af"
        />
      )}
    </Group>
  );
}

// Memoized component - only re-renders when props change
const NodeComponent = memo(NodeComponentInner, (prevProps, nextProps) => {
  return (
    prevProps.node.id === nextProps.node.id &&
    prevProps.node.title === nextProps.node.title &&
    prevProps.node.position.x === nextProps.node.position.x &&
    prevProps.node.position.y === nextProps.node.position.y &&
    prevProps.node.isVisible === nextProps.node.isVisible &&
    prevProps.node.isExpanded === nextProps.node.isExpanded &&
    prevProps.node.children.length === nextProps.node.children.length &&
    prevProps.node.style === nextProps.node.style &&
    prevProps.node.branchColor === nextProps.node.branchColor &&
    prevProps.node.images?.length === nextProps.node.images?.length &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isFocused === nextProps.isFocused &&
    prevProps.isBlurred === nextProps.isBlurred
  );
});

export default NodeComponent;
