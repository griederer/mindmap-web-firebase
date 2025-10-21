/**
 * Zod Validation Schemas for NODEM
 * Runtime validation for all data types
 */

import { z } from 'zod';

// Node Schemas
export const NodePositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const NodeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  image: z.string().optional(),
  children: z.array(z.string()),
  level: z.number().int().min(0),
  parentId: z.string().nullable(),
  position: NodePositionSchema,
  isExpanded: z.boolean(),
  isVisible: z.boolean(),
  createdAt: z.number().int().positive(),
  updatedAt: z.number().int().positive(),
});

// Action Schemas
const BaseActionSchema = z.object({
  id: z.string().min(1),
  timestamp: z.number().int().positive(),
  duration: z.number().int().positive().optional(),
});

export const ExpandActionSchema = BaseActionSchema.extend({
  type: z.literal('expand'),
  nodeId: z.string().min(1),
});

export const CollapseActionSchema = BaseActionSchema.extend({
  type: z.literal('collapse'),
  nodeId: z.string().min(1),
});

export const ShowInfoActionSchema = BaseActionSchema.extend({
  type: z.literal('showInfo'),
  nodeId: z.string().min(1),
});

export const HideInfoActionSchema = BaseActionSchema.extend({
  type: z.literal('hideInfo'),
  nodeId: z.string().min(1),
});

export const FocusActionSchema = BaseActionSchema.extend({
  type: z.literal('focus'),
  nodeId: z.string().min(1),
});

export const UnfocusActionSchema = BaseActionSchema.extend({
  type: z.literal('unfocus'),
});

export const ShowImageFullscreenActionSchema = BaseActionSchema.extend({
  type: z.literal('showImageFullscreen'),
  nodeId: z.string().min(1),
});

export const HideImageFullscreenActionSchema = BaseActionSchema.extend({
  type: z.literal('hideImageFullscreen'),
});

export const ZoomActionSchema = BaseActionSchema.extend({
  type: z.literal('zoom'),
  level: z.number().positive(),
  targetX: z.number().optional(),
  targetY: z.number().optional(),
});

export const PanActionSchema = BaseActionSchema.extend({
  type: z.literal('pan'),
  x: z.number(),
  y: z.number(),
});

export const ActionSchema = z.discriminatedUnion('type', [
  ExpandActionSchema,
  CollapseActionSchema,
  ShowInfoActionSchema,
  HideInfoActionSchema,
  FocusActionSchema,
  UnfocusActionSchema,
  ShowImageFullscreenActionSchema,
  HideImageFullscreenActionSchema,
  ZoomActionSchema,
  PanActionSchema,
]);

// Project Schemas
export const ProjectMetadataSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  author: z.string().optional(),
  createdAt: z.number().int().positive(),
  updatedAt: z.number().int().positive(),
  thumbnail: z.string().optional(),
  tags: z.array(z.string()).optional(),
  version: z.string().regex(/^\d+\.\d+\.\d+$/), // Semantic versioning
});

export const ProjectSettingsSchema = z.object({
  defaultZoom: z.number().positive().optional(),
  defaultPosition: z.object({
    x: z.number(),
    y: z.number(),
  }).optional(),
  theme: z.enum(['light', 'dark']).optional(),
}).optional();

export const ProjectSchema = z.object({
  projectId: z.string().min(1),
  metadata: ProjectMetadataSchema,
  nodes: z.record(z.string(), NodeSchema),
  rootNodeId: z.string().min(1),
  actions: z.array(ActionSchema),
  settings: ProjectSettingsSchema,
});

// Type inference helpers
export type NodeSchemaType = z.infer<typeof NodeSchema>;
export type ActionSchemaType = z.infer<typeof ActionSchema>;
export type ProjectSchemaType = z.infer<typeof ProjectSchema>;
