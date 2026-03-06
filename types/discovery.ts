// Core discovery and behavior modeling types for Web-to-Logic Synthesis
// These types are used across discovery APIs, inference modules, and replica generation.

export type DiscoveryScope = 'single_page' | 'multi_page' | 'authenticated_area';

export interface DiscoverySession {
  id: string;
  targetUrl: string;
  scope: DiscoveryScope;
  createdAt: number;
  updatedAt: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  errorMessage?: string;
  // High-level progress indicators for the discovery pipeline
  progress: {
    scrapeCompleted: boolean;
    behaviorAnalysisCompleted: boolean;
    dataModelInferenceCompleted: boolean;
    designSystemExtractionCompleted: boolean;
    qualityAnalysisCompleted: boolean;
  };
  // IDs referencing associated artifacts
  artifacts: {
    behaviorGraphId?: string;
    dataModelId?: string;
    designSystemId?: string;
    qualityReportId?: string;
  };
}

export interface DiscoveredPage {
  id: string;
  url: string;
  title?: string;
  description?: string;
  // Simple content summary from Firecrawl / scraping
  contentSummary?: string;
  // Raw HTML and markdown are stored in external systems (e.g., Firecrawl / DB).
  // We only keep lightweight references and metadata here.
  pathDepth: number;
  isAuthenticatedArea?: boolean;
}

export type ElementType =
  | 'link'
  | 'button'
  | 'input'
  | 'form'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'textarea'
  | 'modal'
  | 'toast'
  | 'other';

export interface DiscoveredElement {
  id: string;
  pageId: string;
  type: ElementType;
  selector: string;
  textContent?: string;
  attributes?: Record<string, string | boolean | number>;
  isInteractive: boolean;
}

export interface DiscoveredFormField {
  name: string;
  type: string;
  label?: string;
  required?: boolean;
}

export interface DiscoveredForm {
  id: string;
  pageId: string;
  selector: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  action?: string;
  fields: DiscoveredFormField[];
}

// Behavior graph modeling

export type UIStateId = string;

export interface UIState {
  id: UIStateId;
  pageId: string;
  description: string;
  // Optional reference to a screenshot or DOM snapshot identifier
  snapshotRef?: string;
}

export type TransitionTriggerType =
  | 'click'
  | 'submit'
  | 'change'
  | 'navigation'
  | 'load'
  | 'custom';

export interface TransitionTrigger {
  type: TransitionTriggerType;
  selector?: string;
  description?: string;
}

export interface TransitionSideEffect {
  description: string;
  // e.g., 'show_error', 'open_modal', 'navigate', 'update_field'
  type?: string;
}

export interface Transition {
  id: string;
  fromState: UIStateId;
  toState: UIStateId;
  trigger: TransitionTrigger;
  preconditions?: string[];
  sideEffects?: TransitionSideEffect[];
}

export interface BehaviorGraph {
  id: string;
  sessionId: string;
  states: UIState[];
  transitions: Transition[];
  initialStateId?: UIStateId;
}

