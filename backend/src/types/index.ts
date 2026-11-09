import { Request } from 'express';

// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  avatar?: string;
  bio?: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  created_at: Date;
}

// Content Types
export enum ContentType {
  MOVIE = 'movie',
  BOOK = 'book'
}

export interface Content {
  id: number;
  type: ContentType;
  external_id: string;
  title: string;
  description?: string;
  year?: number;
  poster_url?: string;
  metadata?: any;
  created_at: Date;
}

// Rating Types
export interface Rating {
  id: number;
  user_id: number;
  content_id: number;
  rating: number;
  created_at: Date;
  updated_at: Date;
}

// Review Types
export interface Review {
  id: number;
  user_id: number;
  content_id: number;
  text: string;
  created_at: Date;
  updated_at: Date;
}

export interface ReviewWithUser extends Review {
  username: string;
  avatar?: string;
}

// List Types
export enum ListType {
  WATCHED = 'watched',
  TO_WATCH = 'to_watch',
  READ = 'read',
  TO_READ = 'to_read',
  CUSTOM = 'custom'
}

export interface List {
  id: number;
  user_id: number;
  name: string;
  type: ListType;
  description?: string;
  created_at: Date;
}

export interface ListItem {
  id: number;
  list_id: number;
  content_id: number;
  added_at: Date;
}

// Activity Types
export enum ActivityType {
  RATING = 'rating',
  REVIEW = 'review',
  LIST_ADD = 'list_add'
}

export interface Activity {
  id: number;
  user_id: number;
  type: ActivityType;
  content_id: number;
  metadata?: any;
  created_at: Date;
}

export interface ActivityWithDetails extends Activity {
  username: string;
  avatar?: string;
  content_title: string;
  content_poster_url?: string;
  content_type: ContentType;
}

// Follow Types
export interface Follow {
  id: number;
  follower_id: number;
  following_id: number;
  created_at: Date;
}

// Auth Types
export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends AuthRequest {
  username: string;
  password_confirm: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

// External API Types (TMDb, Google Books)
export interface TMDbMovie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  genre_ids: number[];
}

export interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    publishedDate?: string;
    pageCount?: number;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
  };
}

// Request with User
export interface RequestWithUser extends Request {
  user?: {
    userId: number;
    email: string;
    username: string;
  };
}
