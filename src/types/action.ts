/**
 * Action Type Definitions for NODEM
 * Represents user interactions that can be recorded and replayed as presentations
 */

import { NodeId } from './node';

export type ActionType =
  | 'expand'
  | 'collapse'
  | 'showInfo'
  | 'hideInfo'
  | 'focus'
  | 'unfocus'
  | 'showImageFullscreen'
  | 'hideImageFullscreen'
  | 'zoom'
  | 'pan';

// Base action interface
export interface BaseAction {
  id: string;
  timestamp: number; // Unix timestamp when action was recorded
  duration?: number; // Optional animation duration override (ms)
}

// Expand node action
export interface ExpandAction extends BaseAction {
  type: 'expand';
  nodeId: NodeId;
}

// Collapse node action
export interface CollapseAction extends BaseAction {
  type: 'collapse';
  nodeId: NodeId;
}

// Show node detail panel
export interface ShowInfoAction extends BaseAction {
  type: 'showInfo';
  nodeId: NodeId;
}

// Hide node detail panel
export interface HideInfoAction extends BaseAction {
  type: 'hideInfo';
  nodeId: NodeId;
}

// Focus on node (blur others)
export interface FocusAction extends BaseAction {
  type: 'focus';
  nodeId: NodeId;
}

// Remove focus
export interface UnfocusAction extends BaseAction {
  type: 'unfocus';
}

// Show image in fullscreen
export interface ShowImageFullscreenAction extends BaseAction {
  type: 'showImageFullscreen';
  nodeId: NodeId;
}

// Hide fullscreen image
export interface HideImageFullscreenAction extends BaseAction {
  type: 'hideImageFullscreen';
}

// Zoom camera
export interface ZoomAction extends BaseAction {
  type: 'zoom';
  level: number; // Zoom level (1 = 100%, 2 = 200%, etc.)
  targetX?: number; // Optional zoom center x
  targetY?: number; // Optional zoom center y
}

// Pan camera
export interface PanAction extends BaseAction {
  type: 'pan';
  x: number; // Target x position
  y: number; // Target y position
}

// Union type of all actions
export type Action =
  | ExpandAction
  | CollapseAction
  | ShowInfoAction
  | HideInfoAction
  | FocusAction
  | UnfocusAction
  | ShowImageFullscreenAction
  | HideImageFullscreenAction
  | ZoomAction
  | PanAction;
