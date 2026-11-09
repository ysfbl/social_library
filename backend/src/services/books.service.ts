import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GOOGLE_BOOKS_BASE_URL = 'https://www.googleapis.com/books/v1';
const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

if (!GOOGLE_BOOKS_API_KEY) {
  console.warn('⚠️  GOOGLE_BOOKS_API_KEY is not set in environment variables');
}

// Google Books API Response Interfaces
interface BookVolumeInfo {
  title: string;
  subtitle?: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  pageCount?: number;
  categories?: string[];
  averageRating?: number;
  ratingsCount?: number;
  imageLinks?: {
    smallThumbnail?: string;
    thumbnail?: string;
    small?: string;
    medium?: string;
    large?: string;
  };
  language?: string;
  previewLink?: string;
  infoLink?: string;
}

interface GoogleBook {
  kind: string;
  id: string;
  etag: string;
  selfLink: string;
  volumeInfo: BookVolumeInfo;
}

interface GoogleBooksSearchResponse {
  kind: string;
  totalItems: number;
  items?: GoogleBook[];
}

// Helper function to get best quality image
export const getBookImageUrl = (volumeInfo: BookVolumeInfo): string | null => {
  if (!volumeInfo.imageLinks) return null;

  // Return the highest quality image available
  return (
    volumeInfo.imageLinks.large ||
    volumeInfo.imageLinks.medium ||
    volumeInfo.imageLinks.small ||
    volumeInfo.imageLinks.thumbnail ||
    volumeInfo.imageLinks.smallThumbnail ||
    null
  );
};

// Search books by title, author, or ISBN
export const searchBooks = async (
  query: string,
  startIndex: number = 0,
  maxResults: number = 20
): Promise<GoogleBooksSearchResponse> => {
  try {
    const response = await axios.get(`${GOOGLE_BOOKS_BASE_URL}/volumes`, {
      params: {
        q: query,
        key: GOOGLE_BOOKS_API_KEY,
        startIndex,
        maxResults,
        langRestrict: 'tr', // Prefer Turkish books
        orderBy: 'relevance',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Google Books search error:', error);
    throw new Error('Failed to search books from Google Books');
  }
};

// Get book details by ID
export const getBookDetails = async (bookId: string): Promise<GoogleBook> => {
  try {
    const response = await axios.get(`${GOOGLE_BOOKS_BASE_URL}/volumes/${bookId}`, {
      params: {
        key: GOOGLE_BOOKS_API_KEY,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Google Books get book details error:', error);
    throw new Error('Failed to get book details from Google Books');
  }
};

// Search books by author
export const searchBooksByAuthor = async (
  author: string,
  startIndex: number = 0,
  maxResults: number = 20
): Promise<GoogleBooksSearchResponse> => {
  try {
    const response = await axios.get(`${GOOGLE_BOOKS_BASE_URL}/volumes`, {
      params: {
        q: `inauthor:${author}`,
        key: GOOGLE_BOOKS_API_KEY,
        startIndex,
        maxResults,
        orderBy: 'relevance',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Google Books search by author error:', error);
    throw new Error('Failed to search books by author from Google Books');
  }
};

// Search books by category
export const searchBooksByCategory = async (
  category: string,
  startIndex: number = 0,
  maxResults: number = 20
): Promise<GoogleBooksSearchResponse> => {
  try {
    const response = await axios.get(`${GOOGLE_BOOKS_BASE_URL}/volumes`, {
      params: {
        q: `subject:${category}`,
        key: GOOGLE_BOOKS_API_KEY,
        startIndex,
        maxResults,
        orderBy: 'relevance',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Google Books search by category error:', error);
    throw new Error('Failed to search books by category from Google Books');
  }
};

// Search books by ISBN
export const searchBookByISBN = async (isbn: string): Promise<GoogleBook | null> => {
  try {
    const response = await axios.get(`${GOOGLE_BOOKS_BASE_URL}/volumes`, {
      params: {
        q: `isbn:${isbn}`,
        key: GOOGLE_BOOKS_API_KEY,
      },
    });

    const data: GoogleBooksSearchResponse = response.data;
    return data.items && data.items.length > 0 ? data.items[0] : null;
  } catch (error) {
    console.error('Google Books search by ISBN error:', error);
    throw new Error('Failed to search book by ISBN from Google Books');
  }
};

// Get newest books (recently published)
export const getNewestBooks = async (
  category?: string,
  startIndex: number = 0,
  maxResults: number = 20
): Promise<GoogleBooksSearchResponse> => {
  try {
    const queryParts = [];

    if (category) {
      queryParts.push(`subject:${category}`);
    }

    const query = queryParts.length > 0 ? queryParts.join('+') : 'books';

    const response = await axios.get(`${GOOGLE_BOOKS_BASE_URL}/volumes`, {
      params: {
        q: query,
        key: GOOGLE_BOOKS_API_KEY,
        startIndex,
        maxResults,
        orderBy: 'newest',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Google Books newest books error:', error);
    throw new Error('Failed to get newest books from Google Books');
  }
};

export default {
  searchBooks,
  getBookDetails,
  searchBooksByAuthor,
  searchBooksByCategory,
  searchBookByISBN,
  getNewestBooks,
  getBookImageUrl,
};
