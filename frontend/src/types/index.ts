// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  avatar_id?: number;
  bio?: string;
  created_at: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

// Content Types
export const ContentType = {
  MOVIE: 'movie',
  BOOK: 'book',
} as const;

export type ContentType = typeof ContentType[keyof typeof ContentType];

export interface Content {
  id: number | string;
  type: ContentType;
  title: string;
  description?: string;
  year?: number;
  posterUrl?: string;
  rating?: number;
  metadata?: any;
  average_rating?: number;
  rating_count?: number;
}

// Rating Types
export interface Rating {
  id: number;
  user_id: number;
  content_id: number;
  rating: number;
  created_at: string;
}

// Review Types
export interface Review {
  id: number;
  user_id: number;
  content_id: number;
  text: string;
  created_at: string;
  updated_at: string;
  username?: string;
  avatar?: string;
  avatar_id?: number;
  like_count?: number | string;
  is_liked_by_user?: boolean;
  reply_count?: number | string;
}

// Reply Types
export interface Reply {
  id: number;
  review_id: number;
  user_id: number;
  text: string;
  created_at: string;
  updated_at: string;
  username?: string;
  avatar?: string;
  avatar_id?: number;
  like_count?: number | string;
  is_liked_by_user?: boolean;
}

// List Types
export const ListType = {
  WATCHED: 'watched',
  TO_WATCH: 'to_watch',
  READ: 'read',
  TO_READ: 'to_read',
  CUSTOM: 'custom',
} as const;

export type ListType = typeof ListType[keyof typeof ListType];

export interface List {
  id: number;
  user_id: number;
  name: string;
  type: ListType;
  description?: string;
  created_at: string;
}

// Activity Types
export const ActivityType = {
  RATING: 'rating',
  REVIEW: 'review',
  ADD_TO_LIST: 'add_to_list',
} as const;

export type ActivityType = typeof ActivityType[keyof typeof ActivityType];

export interface Activity {
  id: number;
  user_id: number;
  activity_type: ActivityType;
  content_id: number;
  external_id: string;
  content_type: ContentType;
  content_title: string;
  content_year?: number;
  poster_url?: string;
  rating?: number;
  review_text?: string;
  list_name?: string;
  username: string;
  avatar?: string;
  avatar_id?: number;
  created_at: string;
  metadata?: any;
  like_count?: number;
  user_liked?: boolean;
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
  total?: number;
  hasMore?: boolean;
}
