import { io, Socket } from 'socket.io-client';
import type { ClientEvents, ServerEvents } from '@/types';

class WebSocketClient {
  private socket: Socket<ServerEvents, ClientEvents> | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(url?: string) {
    const wsUrl = url || process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';
    
    this.socket = io(wsUrl, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupEventHandlers();
    return this.socket;
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.disconnect();
      }
    });
  }

  joinSession(sessionId: string) {
    this.socket?.emit('join-session', { sessionId });
  }

  startAnalysis(fileId: string, prompt: string) {
    this.socket?.emit('start-analysis', { fileId, prompt });
  }

  hoverDiagnostic(diagnosticId: string) {
    this.socket?.emit('hover-diagnostic', { diagnosticId });
  }

  applyFix(diagnosticId: string, fixId: string) {
    this.socket?.emit('apply-fix', { diagnosticId, fixId });
  }

  onAnalysisProgress(callback: (data: { stage: string; progress: number }) => void) {
    this.socket?.on('analysis-progress', callback);
  }

  onDiagnosticFound(callback: (data: { diagnostic: any }) => void) {
    this.socket?.on('diagnostic-found', callback);
  }

  onOverlayUpdate(callback: (data: { overlays: any[] }) => void) {
    this.socket?.on('overlay-update', callback);
  }

  onFixApplied(callback: (data: { fixId: string; status: 'success' | 'error' }) => void) {
    this.socket?.on('fix-applied', callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const wsClient = new WebSocketClient();
export default wsClient;
