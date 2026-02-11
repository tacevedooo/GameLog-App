
export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Game {
  _id: string;
  title: string;
  description: string;
  genre: string;
  platform: string[];
  releaseDate: string;
  coverImage: string;
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  _id: string;
  user: string | { _id: string; username: string; email?: string };
  game: string | { _id: string; title: string; coverImage: string };
  hoursPlayed: number;
  rating: number;
  review: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
}

export interface APIResponse<T> {
  data: T;
  message?: string;
}
