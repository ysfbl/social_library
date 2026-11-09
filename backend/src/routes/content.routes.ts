import express from 'express';
import {
  searchContents,
  getMovieDetails,
  getBookDetails,
  getTrendingMovies,
  getTopRatedOnPlatform,
  getMostPopularOnPlatform,
  getContentById,
  getMovieGenres,
  discoverMovies,
} from '../controllers/content.controller';
import { optionalAuthenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Search movies and books
router.get('/search', optionalAuthenticate, searchContents);

// Get trending movies
router.get('/trending/movies', optionalAuthenticate, getTrendingMovies);

// Get top rated contents on platform
router.get('/top-rated', optionalAuthenticate, getTopRatedOnPlatform);

// Get most popular contents on platform
router.get('/popular', optionalAuthenticate, getMostPopularOnPlatform);

// Get movie genres
router.get('/genres', optionalAuthenticate, getMovieGenres);

// Discover movies with filters
router.get('/discover', optionalAuthenticate, discoverMovies);

// Get movie details by TMDb ID
router.get('/movie/:id', optionalAuthenticate, getMovieDetails);

// Get book details by Google Books ID
router.get('/book/:id', optionalAuthenticate, getBookDetails);

// Get content by internal ID (must be last to avoid catching other routes)
router.get('/:id', optionalAuthenticate, getContentById);

export default router;
