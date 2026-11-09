import { Request, Response } from 'express';
import * as tmdbService from '../services/tmdb.service';
import * as booksService from '../services/books.service';
import * as contentModel from '../models/content.model';
import { ContentType } from '../types';

// Search movies and books
export const searchContents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, type, page = 1 } = req.query;

    if (!q) {
      res.status(400).json({
        success: false,
        message: 'Arama sorgusu gereklidir',
      });
      return;
    }

    const query = q as string;
    const pageNum = parseInt(page as string);

    let results: any = {
      movies: [],
      books: [],
    };

    // Search movies
    if (!type || type === 'movie') {
      try {
        const movieResults = await tmdbService.searchMovies(query, pageNum);
        results.movies = movieResults.results.map((movie: any) => ({
          id: movie.id,
          type: 'movie',
          title: movie.title,
          description: movie.overview,
          year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
          posterUrl: tmdbService.getImageUrl(movie.poster_path),
          rating: movie.vote_average,
          metadata: {
            genre_ids: movie.genre_ids,
            popularity: movie.popularity,
            vote_count: movie.vote_count,
          },
        }));
      } catch (error) {
        console.error('Movie search error:', error);
      }
    }

    // Search books
    if (!type || type === 'book') {
      try {
        const bookResults = await booksService.searchBooks(query, (pageNum - 1) * 20, 20);
        if (bookResults.items) {
          results.books = bookResults.items.map((book: any) => ({
            id: book.id,
            type: 'book',
            title: book.volumeInfo.title,
            description: book.volumeInfo.description,
            year: book.volumeInfo.publishedDate
              ? new Date(book.volumeInfo.publishedDate).getFullYear()
              : null,
            posterUrl: booksService.getBookImageUrl(book.volumeInfo),
            authors: book.volumeInfo.authors,
            metadata: {
              authors: book.volumeInfo.authors,
              publisher: book.volumeInfo.publisher,
              pageCount: book.volumeInfo.pageCount,
              categories: book.volumeInfo.categories,
            },
          }));
        }
      } catch (error) {
        console.error('Book search error:', error);
      }
    }

    res.status(200).json({
      success: true,
      data: results,
      page: pageNum,
    });
  } catch (error) {
    console.error('Search contents error:', error);
    res.status(500).json({
      success: false,
      message: 'Arama sırasında bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get movie details
export const getMovieDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    console.log('Getting movie details for ID:', id);

    // Check if we already have this content in database by internal ID
    const numericId = parseInt(id);
    if (!isNaN(numericId)) {
      const existingContent = await contentModel.getContentById(numericId);

      if (existingContent && existingContent.type === ContentType.MOVIE) {
        console.log('Movie found in database, using cached data');
        // Content exists in DB, get it with rating and also fetch fresh TMDb data
        const tmdbId = parseInt(existingContent.external_id);
        const movie = await tmdbService.getMovieDetails(tmdbId);

        // Update database with latest TMDb data
        await contentModel.getOrCreateContent(
          ContentType.MOVIE,
          movie.id.toString(),
          movie.title,
          movie.overview,
          movie.release_date ? new Date(movie.release_date).getFullYear() : null,
          tmdbService.getImageUrl(movie.poster_path),
          JSON.stringify({
            runtime: movie.runtime,
            genres: movie.genres,
            vote_average: movie.vote_average,
            vote_count: movie.vote_count,
            production_companies: movie.production_companies,
            cast: movie.credits?.cast?.slice(0, 10),
            directors: movie.credits?.crew?.filter((c: any) => c.job === 'Director'),
          })
        );

        // Get platform rating
        const contentWithRating = await contentModel.getContentWithRating(numericId);

        res.status(200).json({
          success: true,
          data: {
            ...contentWithRating,
            tmdb_rating: movie.vote_average,
            tmdb_vote_count: movie.vote_count,
          },
        });
        return;
      }
    }

    // Not in database, treat as TMDb ID
    const movieId = parseInt(id);
    console.log('Fetching movie from TMDb with ID:', movieId);

    // Get from TMDb
    const movie = await tmdbService.getMovieDetails(movieId);

    // Get or create in database
    const dbContent = await contentModel.getOrCreateContent(
      ContentType.MOVIE,
      movie.id.toString(),
      movie.title,
      movie.overview,
      movie.release_date ? new Date(movie.release_date).getFullYear() : null,
      tmdbService.getImageUrl(movie.poster_path),
      JSON.stringify({
        runtime: movie.runtime,
        genres: movie.genres,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        production_companies: movie.production_companies,
        cast: movie.credits?.cast?.slice(0, 10),
        directors: movie.credits?.crew?.filter((c: any) => c.job === 'Director'),
      })
    );

    // Get platform rating
    const contentWithRating = await contentModel.getContentWithRating(dbContent.id);

    res.status(200).json({
      success: true,
      data: {
        ...contentWithRating,
        tmdb_rating: movie.vote_average,
        tmdb_vote_count: movie.vote_count,
      },
    });
  } catch (error) {
    console.error('Get movie details error:', error);
    res.status(500).json({
      success: false,
      message: 'Film detayları alınırken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get book details
export const getBookDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    console.log('Getting book details for ID:', id);

    let googleBooksId = id;

    // Check if ID is a number (database ID) or a Google Books ID (alphanumeric string)
    // Google Books IDs contain letters, database IDs are pure numbers
    const isDbId = /^\d+$/.test(id);

    if (isDbId) {
      // It's a database ID, fetch the external_id first
      console.log('ID is a database ID, fetching external_id');
      const existingContent = await contentModel.getContentById(parseInt(id));

      if (!existingContent) {
        res.status(404).json({
          success: false,
          message: 'Kitap bulunamadı',
        });
        return;
      }

      googleBooksId = existingContent.external_id;
      console.log('Found external_id:', googleBooksId);

      // Return the content with rating directly from database
      const contentWithRating = await contentModel.getContentWithRating(parseInt(id));

      res.status(200).json({
        success: true,
        data: contentWithRating,
      });
      return;
    }

    // It's a Google Books ID, fetch from API
    console.log('ID is a Google Books ID, fetching from API');

    // Get from Google Books
    const book = await booksService.getBookDetails(googleBooksId);

    console.log('Book from Google Books:', book.volumeInfo.title);

    // Get or create in database
    const dbContent = await contentModel.getOrCreateContent(
      ContentType.BOOK,
      book.id,
      book.volumeInfo.title,
      book.volumeInfo.description || null,
      book.volumeInfo.publishedDate
        ? new Date(book.volumeInfo.publishedDate).getFullYear()
        : null,
      booksService.getBookImageUrl(book.volumeInfo),
      JSON.stringify({
        authors: book.volumeInfo.authors,
        publisher: book.volumeInfo.publisher,
        pageCount: book.volumeInfo.pageCount,
        categories: book.volumeInfo.categories,
        language: book.volumeInfo.language,
      })
    );

    console.log('DB Content created/updated:', dbContent.id);

    // Get platform rating
    const contentWithRating = await contentModel.getContentWithRating(dbContent.id);

    console.log('Content with rating:', contentWithRating);

    res.status(200).json({
      success: true,
      data: contentWithRating,
    });
  } catch (error) {
    console.error('Get book details error:', error);
    res.status(500).json({
      success: false,
      message: 'Kitap detayları alınırken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get trending movies
export const getTrendingMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const movies = await tmdbService.getTrendingMovies('week');

    const formattedMovies = movies.map((movie: any) => ({
      id: movie.id,
      type: 'movie',
      title: movie.title,
      description: movie.overview,
      year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
      posterUrl: tmdbService.getImageUrl(movie.poster_path),
      rating: movie.vote_average,
      metadata: {
        genre_ids: movie.genre_ids,
        popularity: movie.popularity,
      },
    }));

    res.status(200).json({
      success: true,
      data: formattedMovies,
    });
  } catch (error) {
    console.error('Get trending movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Trend filmler alınırken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get top rated contents from platform
export const getTopRatedOnPlatform = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, limit = 20, page = 1 } = req.query;

    const limitNum = parseInt(limit as string);
    const pageNum = parseInt(page as string);
    const offset = (pageNum - 1) * limitNum;

    const contentType = type ? (type as ContentType) : undefined;
    const contents = await contentModel.getTopRatedContents(contentType, limitNum, offset);

    res.status(200).json({
      success: true,
      data: contents,
      page: pageNum,
      limit: limitNum,
    });
  } catch (error) {
    console.error('Get top rated on platform error:', error);
    res.status(500).json({
      success: false,
      message: 'En yüksek puanlılar alınırken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get most popular contents on platform
export const getMostPopularOnPlatform = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, limit = 20, page = 1 } = req.query;

    const limitNum = parseInt(limit as string);
    const pageNum = parseInt(page as string);
    const offset = (pageNum - 1) * limitNum;

    const contentType = type ? (type as ContentType) : undefined;
    const contents = await contentModel.getMostPopularContents(contentType, limitNum, offset);

    res.status(200).json({
      success: true,
      data: contents,
      page: pageNum,
      limit: limitNum,
    });
  } catch (error) {
    console.error('Get most popular on platform error:', error);
    res.status(500).json({
      success: false,
      message: 'En popüler içerikler alınırken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get content by internal ID
export const getContentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    console.log('getContentById called with ID:', id);
    const contentId = parseInt(id);

    if (isNaN(contentId)) {
      console.log('Invalid content ID:', id);
      res.status(400).json({
        success: false,
        message: 'Geçersiz içerik ID',
      });
      return;
    }

    const content = await contentModel.getContentWithRating(contentId);

    if (!content) {
      res.status(404).json({
        success: false,
        message: 'İçerik bulunamadı',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error('Get content by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'İçerik alınırken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get movie genres
export const getMovieGenres = async (req: Request, res: Response): Promise<void> => {
  try {
    const genres = await tmdbService.getMovieGenres();

    res.status(200).json({
      success: true,
      data: genres,
    });
  } catch (error) {
    console.error('Get movie genres error:', error);
    res.status(500).json({
      success: false,
      message: 'Film türleri alınırken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Discover movies with filters
export const discoverMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const { genre, year, minRating, page = 1 } = req.query;

    const pageNum = parseInt(page as string);

    // Build discover query
    let movies;
    if (genre) {
      movies = await tmdbService.getMoviesByGenre(parseInt(genre as string), pageNum);
    } else {
      movies = await tmdbService.getPopularMovies(pageNum);
    }

    // Filter by year and rating if provided
    let results = movies.results;

    if (year) {
      const yearNum = parseInt(year as string);
      results = results.filter((movie: any) => {
        if (!movie.release_date) return false;
        const movieYear = new Date(movie.release_date).getFullYear();
        return movieYear === yearNum;
      });
    }

    if (minRating) {
      const minRatingNum = parseFloat(minRating as string);
      results = results.filter((movie: any) => movie.vote_average >= minRatingNum);
    }

    const formattedMovies = results.map((movie: any) => ({
      id: movie.id,
      type: 'movie',
      title: movie.title,
      description: movie.overview,
      year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
      posterUrl: tmdbService.getImageUrl(movie.poster_path),
      rating: movie.vote_average,
      metadata: {
        genre_ids: movie.genre_ids,
        popularity: movie.popularity,
      },
    }));

    res.status(200).json({
      success: true,
      data: formattedMovies,
      page: pageNum,
    });
  } catch (error) {
    console.error('Discover movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Film keşfetme sırasında bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export default {
  searchContents,
  getMovieDetails,
  getBookDetails,
  getTrendingMovies,
  getTopRatedOnPlatform,
  getMostPopularOnPlatform,
  getContentById,
  getMovieGenres,
  discoverMovies,
};
