// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name?: string;
  figmaToken?: string;
  createdAt: Date;
}

// Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'delivered' | 'error';
  metadata?: any;
}

// Figma Types
export interface FigmaFile {
  id: string;
  name: string;
  lastModified: Date;
  thumbnailUrl?: string;
}

export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  path: string[];
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// Analysis Types
export type DiagnosticType = 
  | 'LAYOUT' 
  | 'TYPOGRAPHY' 
  | 'COLOR' 
  | 'ACCESSIBILITY' 
  | 'COMPONENT' 
  | 'PERFORMANCE';

export type Severity = 'CRITICAL' | 'WARNING' | 'INFO';

export interface Diagnostic {
  id: string;
  type: DiagnosticType;
  severity: Severity;
  nodeId: string;
  message: string;
  suggestion?: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  fixes?: Fix[];
}

export interface Fix {
  id: string;
  description: string;
  changes: any;
  applied: boolean;
  appliedAt?: Date;
}

export interface Analysis {
  id: string;
  projectId: string;
  prompt: string;
  status: 'PENDING' | 'ANALYZING' | 'COMPLETED' | 'ERROR';
  results?: any;
  diagnostics: Diagnostic[];
  startedAt: Date;
  completedAt?: Date;
}

export interface Project {
  id: string;
  figmaFileId: string;
  figmaFileName: string;
  lastAnalyzed?: Date;
  analyses: Analysis[];
  createdAt: Date;
}

// Overlay Types
export interface Overlay {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  position: { x: number; y: number };
  size: { width: number; height: number };
  message: string;
  suggestion?: string;
  autoFix?: () => Promise<void>;
}

// WebSocket Event Types
export interface ClientEvents {
  'join-session': { sessionId: string };
  'start-analysis': { fileId: string; prompt: string };
  'hover-diagnostic': { diagnosticId: string };
  'apply-fix': { diagnosticId: string; fixId: string };
}

export interface ServerEvents {
  'analysis-progress': { stage: string; progress: number };
  'diagnostic-found': { diagnostic: Diagnostic };
  'overlay-update': { overlays: Overlay[] };
  'fix-applied': { fixId: string; status: 'success' | 'error' };
}
