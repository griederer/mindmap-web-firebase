/**
 * Node Action Menu - Konva
 * Minimal floating toolbar with clear icons
 */

import { Group, Circle, Text } from 'react-konva';
import Konva from 'konva';

interface NodeActionMenuProps {
  x: number;
  y: number;
  onEdit: () => void;
  onShowInfo: () => void;
  onFocus: () => void;
  onAddChild: () => void;
  onDelete: () => void;
  onManageRelationships: () => void;
}

const ICON_SIZE = 32;
const ICON_SPACING = 6;
const HORIZONTAL_OFFSET = 10; // Ajuste para centrar mejor
const BUTTON_BG_COLOR = '#2b2b2b';
const BUTTON_HOVER_COLOR = '#444444';
const ICON_COLOR = '#ffffff';

export default function NodeActionMenu({
  x,
  y,
  onEdit,
  onShowInfo,
  onFocus,
  onAddChild,
  onDelete,
  onManageRelationships,
}: NodeActionMenuProps) {
  const buttons = [
    { symbol: '✎', onClick: onEdit, label: 'Edit' },
    { symbol: 'i', onClick: onShowInfo, label: 'Info' },
    { symbol: '◉', onClick: onFocus, label: 'Focus' },
    { symbol: '⛓', onClick: onManageRelationships, label: 'Relationships' },
    { symbol: '+', onClick: onAddChild, label: 'Add' },
    { symbol: '×', onClick: onDelete, label: 'Delete' },
  ];

  const NODE_WIDTH = 200;
  const totalWidth = buttons.length * (ICON_SIZE + ICON_SPACING) - ICON_SPACING;

  // Center the ribbon: node center (x + NODE_WIDTH/2) minus half ribbon width
  const nodeCenterX = x + NODE_WIDTH / 2;
  const startX = nodeCenterX - totalWidth / 2 + HORIZONTAL_OFFSET;

  return (
    <Group x={startX} y={y - ICON_SIZE - 20}>
      {buttons.map((button, index) => {
        const buttonX = index * (ICON_SIZE + ICON_SPACING);

        return (
          <Group key={index} x={buttonX}>
            {/* Button background */}
            <Circle
              radius={ICON_SIZE / 2}
              fill={BUTTON_BG_COLOR}
              onClick={button.onClick}
              onMouseEnter={(e) => {
                const container = e.target.getStage()?.container();
                if (container) container.style.cursor = 'pointer';
                const target = e.target as Konva.Circle;
                target.fill(BUTTON_HOVER_COLOR);
              }}
              onMouseLeave={(e) => {
                const container = e.target.getStage()?.container();
                if (container) container.style.cursor = 'default';
                const target = e.target as Konva.Circle;
                target.fill(BUTTON_BG_COLOR);
              }}
            />

            {/* Icon symbol */}
            <Text
              x={-ICON_SIZE / 2}
              y={-ICON_SIZE / 2}
              width={ICON_SIZE}
              height={ICON_SIZE}
              text={button.symbol}
              fontSize={18}
              fontFamily="system-ui, -apple-system"
              fill={ICON_COLOR}
              align="center"
              verticalAlign="middle"
              listening={false}
            />
          </Group>
        );
      })}
    </Group>
  );
}
