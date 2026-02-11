
const BASE_URL = 'http://localhost:8800/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Auth
  async login(credentials: any) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Login failed');
    return res.json();
  },

  async register(data: any) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Registration failed');
    return res.json();
  },

  // Games
  async getGames() {
    const res = await fetch(`${BASE_URL}/game`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch games');
    return res.json();
  },

  async getGameById(id: string) {
    const res = await fetch(`${BASE_URL}/game/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Game not found');
    return res.json();
  },

  async createGame(data: any) {
    const res = await fetch(`${BASE_URL}/game`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Failed to create game');
    return res.json();
  },

  async updateGame(id: string, data: any) {
    const res = await fetch(`${BASE_URL}/game/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update game');
    return res.json();
  },

  async deleteGame(id: string) {
    const res = await fetch(`${BASE_URL}/game/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete game');
    return res.json();
  },

  // Experiences
  async getExperiences() {
    const res = await fetch(`${BASE_URL}/experience`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch experiences');
    return res.json();
  },

  async getExperiencesByUser(userId: string) {
    const res = await fetch(`${BASE_URL}/experience/user/${userId}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch user experiences');
    return res.json();
  },

  async createExperience(data: any) {
    const res = await fetch(`${BASE_URL}/experience`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create experience');
    return res.json();
  },

  async updateExperience(id: string, data: any) {
    const res = await fetch(`${BASE_URL}/experience/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update experience');
    return res.json();
  },

  async deleteExperience(id: string) {
    const res = await fetch(`${BASE_URL}/experience/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete experience');
    return res.json();
  },
};
