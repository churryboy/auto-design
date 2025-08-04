import axios from 'axios';
import type { User, Project, Analysis, FigmaFile } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const { data } = await api.post<{ user: User; token: string }>('/auth/login', {
      email,
      password,
    });
    localStorage.setItem('token', data.token);
    return data;
  },

  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },

  connectFigma: () => {
    window.location.href = `${API_URL}/auth/figma`;
  },
};

// Projects API
export const projectsAPI = {
  getAll: async () => {
    const { data } = await api.get<Project[]>('/projects');
    return data;
  },

  create: async (figmaFileId: string, figmaFileName: string) => {
    const { data } = await api.post<Project>('/projects', {
      figmaFileId,
      figmaFileName,
    });
    return data;
  },

  get: async (id: string) => {
    const { data } = await api.get<Project>(`/projects/${id}`);
    return data;
  },

  delete: async (id: string) => {
    await api.delete(`/projects/${id}`);
  },
};

// Figma API
export const figmaAPI = {
  getFiles: async () => {
    const { data } = await api.get<FigmaFile[]>('/figma/files');
    return data;
  },

  getFile: async (fileId: string) => {
    const { data } = await api.get(`/figma/files/${fileId}`);
    return data;
  },

  getFrames: async (fileId: string) => {
    const { data } = await api.get(`/figma/files/${fileId}/frames`);
    return data;
  },

  exportFile: async (fileId: string, format: 'png' | 'svg' | 'pdf') => {
    const { data } = await api.post(`/figma/files/${fileId}/export`, { format });
    return data;
  },
};

// Analysis API
export const analysisAPI = {
  start: async (fileId: string, prompt: string) => {
    const { data } = await api.post<{ analysisId: string }>('/analysis/start', {
      fileId,
      prompt,
    });
    return data;
  },

  getStatus: async (id: string) => {
    const { data } = await api.get<Analysis>(`/analysis/${id}/status`);
    return data;
  },

  getResults: async (id: string) => {
    const { data } = await api.get<Analysis>(`/analysis/${id}/results`);
    return data;
  },

  applyFix: async (analysisId: string, diagnosticId: string, fixId: string) => {
    const { data } = await api.post(`/analysis/${analysisId}/apply-fix`, {
      diagnosticId,
      fixId,
    });
    return data;
  },
};

// Chat API
export const chatAPI = {
  sendMessage: async (analysisId: string, message: string) => {
    const { data } = await api.post('/chat/message', {
      analysisId,
      message,
    });
    return data;
  },

  getHistory: async (analysisId?: string) => {
    const params = analysisId ? { analysisId } : {};
    const { data } = await api.get('/chat/history', { params });
    return data;
  },

  deleteHistory: async (id: string) => {
    await api.delete(`/chat/history/${id}`);
  },
};

export default api;
