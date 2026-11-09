import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

if (!TMDB_API_KEY) {
  console.warn('⚠️  TMDB_API_KEY is not set in environment variables');
}

// TMDb API Response Interfaces
interface TMDbMovie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  original_language: string;
  popularity: number;
}

interface TMDbMovieDetails extends TMDbMovie {
  runtime: number;
  genres: Array<{ id: number; name: string }>;
  production_companies: Array<{ id: number; name: string }>;
  credits?: {
    cast: Array<{ id: number; name: string; character: string }>;
    crew: Array<{ id: number; name: string; job: string }>;
  };
}

interface TMDbSearchResponse {
  page: number;
  results: TMDbMovie[];
  total_pages: number;
  total_results: number;
}

// Helper function to get full image URL
export const getImageUrl = (path: string | null, size: string = 'w500'): string | null => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

// Search movies by title
export const searchMovies = async (query: string, page: number = 1): Promise<TMDbSearchResponse> => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query,
        page,
        language: 'tr-TR',
        include_adult: false,
      },
    });

    return response.data;
  } catch (error) {
    console.error('TMDb search error:', error);
    throw new Error('Failed to search movies from TMDb');
  }
};

// Get movie details by ID
export const getMovieDetails = async (movieId: number): Promise<TMDbMovieDetails> => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'tr-TR',
        append_to_response: 'credits',
      },
    });

    return response.data;
  } catch (error) {
    console.error('TMDb get movie details error:', error);
    throw new Error('Failed to get movie details from TMDb');
  }
};

// Get trending movies
export const getTrendingMovies = async (timeWindow: 'day' | 'week' = 'week'): Promise<TMDbMovie[]> => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/${timeWindow}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'tr-TR',
      },
    });

    return response.data.results;
  } catch (error) {
    console.error('TMDb trending movies error:', error);
    throw new Error('Failed to get trending movies from TMDb');
  }
};

// Get popular movies
export const getPopularMovies = async (page: number = 1): Promise<TMDbSearchResponse> => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'tr-TR',
        page,
      },
    });

    return response.data;
  } catch (error) {
    console.error('TMDb popular movies error:', error);
    throw new Error('Failed to get popular movies from TMDb');
  }
};

// Get top rated movies
export const getTopRatedMovies = async (page: number = 1): Promise<TMDbSearchResponse> => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/top_rated`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'tr-TR',
        page,
      },
    });

    return response.data;
  } catch (error) {
    console.error('TMDb top rated movies error:', error);
    throw new Error('Failed to get top rated movies from TMDb');
  }
};

// Get movies by genre
export const getMoviesByGenre = async (genreId: number, page: number = 1): Promise<TMDbSearchResponse> => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'tr-TR',
        with_genres: genreId,
        page,
      },
    });

    return response.data;
  } catch (error) {
    console.error('TMDb movies by genre error:', error);
    throw new Error('Failed to get movies by genre from TMDb');
  }
};

// Get movie genres
export const getMovieGenres = async (): Promise<Array<{ id: number; name: string }>> => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'tr-TR',
      },
    });

    return response.data.genres;
  } catch (error) {
    console.error('TMDb genres error:', error);
    throw new Error('Failed to get movie genres from TMDb');
  }
};

export default {
  searchMovies,
  getMovieDetails,
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getMoviesByGenre,
  getMovieGenres,
  getImageUrl,
};
