import api from './api';
import type { Content, ContentType, ApiResponse } from '../types';

// Search movies and books
export const searchContents = async (query: string, type?: ContentType, page: number = 1): Promise<{ movies: Content[]; books: Content[] }> => {
  const response = await api.get<ApiResponse<{ movies: Content[]; books: Content[] }>>('/contents/search', {
    params: { q: query, type, page },
  });
  return response.data.data || { movies: [], books: [] };
};

// Get content by internal ID
export const getContentById = async (id: number): Promise<Content> => {
  const response = await api.get<ApiResponse<Content>>(`/contents/${id}`);
  return response.data.data!;
};

// Get movie details by TMDb ID
export const getMovieDetails = async (movieId: number): Promise<Content> => {
  const response = await api.get<ApiResponse<Content>>(`/contents/movie/${movieId}`);
  return response.data.data!;
};

// Get book details by Google Books ID
export const getBookDetails = async (bookId: string): Promise<Content> => {
  const response = await api.get<ApiResponse<Content>>(`/contents/book/${bookId}`);
  return response.data.data!;
};

// Get trending movies
export const getTrendingMovies = async (): Promise<Content[]> => {
  const response = await api.get<ApiResponse<Content[]>>('/contents/trending/movies');
  return response.data.data || [];
};

// Get top rated contents on platform
export const getTopRatedOnPlatform = async (type?: ContentType, limit: number = 20, page: number = 1) => {
  const response = await api.get<ApiResponse<Content[]>>('/contents/top-rated', {
    params: { type, limit, page },
  });
  return response.data.data || [];
};

// Get most popular contents on platform
export const getMostPopularOnPlatform = async (type?: ContentType, limit: number = 20, page: number = 1) => {
  const response = await api.get<ApiResponse<Content[]>>('/contents/popular', {
    params: { type, limit, page },
  });
  return response.data.data || [];
};

// Get movie genres
export const getMovieGenres = async (): Promise<Array<{ id: number; name: string }>> => {
  const response = await api.get<ApiResponse<Array<{ id: number; name: string }>>>('/contents/genres');
  return response.data.data || [];
};

// Discover movies with filters
export const discoverMovies = async (filters: {
  genre?: number;
  year?: number;
  minRating?: number;
  page?: number;
}): Promise<Content[]> => {
  const response = await api.get<ApiResponse<Content[]>>('/contents/discover', {
    params: filters,
  });
  return response.data.data || [];
};

export default {
  searchContents,
  getContentById,
  getMovieDetails,
  getBookDetails,
  getTrendingMovies,
  getTopRatedOnPlatform,
  getMostPopularOnPlatform,
  getMovieGenres,
  discoverMovies,
};
