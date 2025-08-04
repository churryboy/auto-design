import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { User, Project, Analysis, ChatMessage, Diagnostic, Overlay } from '@/types';

interface AppState {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;

  // Project state
  currentProject: Project | null;
  projects: Project[];
  setCurrentProject: (project: Project | null) => void;
  setProjects: (projects: Project[]) => void;

  // Analysis state
  currentAnalysis: Analysis | null;
  analysisProgress: { stage: string; progress: number } | null;
  setCurrentAnalysis: (analysis: Analysis | null) => void;
  setAnalysisProgress: (progress: { stage: string; progress: number } | null) => void;

  // Chat state
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  clearMessages: () => void;

  // Diagnostics state
  diagnostics: Diagnostic[];
  selectedDiagnostic: Diagnostic | null;
  setDiagnostics: (diagnostics: Diagnostic[]) => void;
  addDiagnostic: (diagnostic: Diagnostic) => void;
  setSelectedDiagnostic: (diagnostic: Diagnostic | null) => void;

  // Overlay state
  overlays: Overlay[];
  setOverlays: (overlays: Overlay[]) => void;
  addOverlay: (overlay: Overlay) => void;
  removeOverlay: (id: string) => void;

  // UI state
  isChatOpen: boolean;
  isDiagnosticsOpen: boolean;
  isAnalyzing: boolean;
  toggleChat: () => void;
  toggleDiagnostics: () => void;
  setIsAnalyzing: (analyzing: boolean) => void;
}

export const useStore = create<AppState>()(
  devtools(
    (set) => ({
      // User state
      user: null,
      setUser: (user) => set({ user }),

      // Project state
      currentProject: null,
      projects: [],
      setCurrentProject: (project) => set({ currentProject: project }),
      setProjects: (projects) => set({ projects }),

      // Analysis state
      currentAnalysis: null,
      analysisProgress: null,
      setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
      setAnalysisProgress: (progress) => set({ analysisProgress: progress }),

      // Chat state
      messages: [],
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      updateMessage: (id, updates) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, ...updates } : msg
          ),
        })),
      clearMessages: () => set({ messages: [] }),

      // Diagnostics state
      diagnostics: [],
      selectedDiagnostic: null,
      setDiagnostics: (diagnostics) => set({ diagnostics }),
      addDiagnostic: (diagnostic) =>
        set((state) => ({ diagnostics: [...state.diagnostics, diagnostic] })),
      setSelectedDiagnostic: (diagnostic) => set({ selectedDiagnostic: diagnostic }),

      // Overlay state
      overlays: [],
      setOverlays: (overlays) => set({ overlays }),
      addOverlay: (overlay) =>
        set((state) => ({ overlays: [...state.overlays, overlay] })),
      removeOverlay: (id) =>
        set((state) => ({
          overlays: state.overlays.filter((overlay) => overlay.id !== id),
        })),

      // UI state
      isChatOpen: true,
      isDiagnosticsOpen: true,
      isAnalyzing: false,
      toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
      toggleDiagnostics: () =>
        set((state) => ({ isDiagnosticsOpen: !state.isDiagnosticsOpen })),
      setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
    }),
    {
      name: 'ai-design-review-store',
    }
  )
);
