import api from './api';
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types';

// Register new user
export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', credentials);
  return response.data;
};

// Login user
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  return response.data;
};

// Forgot password
export const forgotPassword = async (email: string): Promise<any> => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

// Reset password
export const resetPassword = async (token: string, password: string, password_confirm: string): Promise<any> => {
  const response = await api.post('/auth/reset-password', { token, password, password_confirm });
  return response.data;
};

// Get current user profile
export const getMe = async (): Promise<User> => {
  const response = await api.get<{ success: boolean; data: User }>('/auth/me');
  return response.data.data;
};

// Save token and user to localStorage
export const saveAuthData = (token: string, user: User) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

// Remove token and user from localStorage
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Get user from localStorage
export const getStoredUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export default {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  saveAuthData,
  clearAuthData,
  getToken,
  getStoredUser,
  isAuthenticated,
};
