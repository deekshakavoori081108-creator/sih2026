const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('katha_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Auth
  async register(data: any) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Registration failed');
    return result;
  },

  async login(data: any) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Login failed');
    return result;
  },

  async getProfile() {
    const res = await fetch(`${API_BASE}/user/profile`, {
      headers: getAuthHeaders(),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to fetch profile');
    return result.user;
  },

  async savePreferences(preferences: { preferredCategory: string; secondaryCategories: string[] }) {
    const res = await fetch(`${API_BASE}/user/preferences`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(preferences),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to save preferences');
    return result;
  },

  // Games
  async getGameChallenges(category: string, gameType: string) {
    const enc = encodeURIComponent(category);
    const res = await fetch(`${API_BASE}/games/challenges/${enc}/${gameType}`, {
      headers: getAuthHeaders(),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to fetch challenges');
    return result;
  },

  async completeLevel(payload: { category: string; gameType: string; score: number; timeSpentSeconds: number; level?: number }) {
    const res = await fetch(`${API_BASE}/games/complete-level`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to complete level');
    return result;
  },

  // Stories
  async getUnlockedStories() {
    const res = await fetch(`${API_BASE}/story/unlocked`, {
      headers: getAuthHeaders(),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to fetch stories');
    return result.stories;
  },

  async getStoryById(storyId: string) {
    const res = await fetch(`${API_BASE}/story/chapter/${storyId}`, {
      headers: getAuthHeaders(),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to fetch story');
    return result.story;
  },

  async generateNextChapter(topic: string, chapterNumber: number, previousSummary?: string) {
    const res = await fetch(`${API_BASE}/story/generate-next`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ topic, chapterNumber, previousSummary }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to generate chapter');
    return result.chapter;
  },

  // Vault
  async getVaultModules() {
    const res = await fetch(`${API_BASE}/vault/modules`, {
      headers: getAuthHeaders(),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to fetch vault modules');
    return result;
  },

  async unlockVaultModule(payload: { moduleId: string; moduleType: string; moduleTitle: string; pointsCost: number }) {
    const res = await fetch(`${API_BASE}/vault/unlock`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to unlock module');
    return result;
  },

  // Parent Analytics
  async getParentAnalytics() {
    const res = await fetch(`${API_BASE}/parent/analytics`, {
      headers: getAuthHeaders(),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to fetch analytics');
    return result;
  },
};
