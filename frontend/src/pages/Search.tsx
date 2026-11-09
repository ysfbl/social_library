import { useState, useEffect } from 'react';
import { searchContents, getTrendingMovies, getMostPopularOnPlatform, getTopRatedOnPlatform, getMovieGenres, discoverMovies } from '../services/content.service';
import type { Content } from '../types';
import ContentCard from '../components/ContentCard';
import ContentSlider from '../components/ContentSlider';
import Navbar from '../components/Navbar';
import movie2 from '../assets/movie2.jpg';
import movie3 from '../assets/movie3.jpg';
import library2 from '../assets/library2.jpg';

const Search = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ movies: Content[]; books: Content[] }>({
    movies: [],
    books: [],
  });
  const [trending, setTrending] = useState<Content[]>([]);
  const [popular, setPopular] = useState<Content[]>([]);
  const [topRated, setTopRated] = useState<Content[]>([]);
  const [filteredResults, setFilteredResults] = useState<Content[]>([]);
  const [genres, setGenres] = useState<Array<{ id: number; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'movies' | 'books'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    minRating: '',
  });


  useEffect(() => {
    loadInitialData();
    loadGenres();
  }, []);

  const loadInitialData = async () => {
    try {
      const [trendingData, popularData, topRatedData] = await Promise.all([
        getTrendingMovies(),
        getMostPopularOnPlatform(undefined, 12),
        getTopRatedOnPlatform(undefined, 12),
      ]);
      // Filter out content with invalid IDs
      const validTrending = trendingData.filter(c => c.id !== undefined && c.id !== null);
      const validPopular = popularData.filter(c => c.id !== undefined && c.id !== null);
      const validTopRated = topRatedData.filter(c => c.id !== undefined && c.id !== null);

      setTrending(validTrending.slice(0, 12));
      setPopular(validPopular);
      setTopRated(validTopRated);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const loadGenres = async () => {
    try {
      const genresData = await getMovieGenres();
      setGenres(genresData);
    } catch (error) {
      console.error('Error loading genres:', error);
    }
  };

  const handleFilterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!filters.genre && !filters.year && !filters.minRating) {
      return;
    }

    setLoading(true);
    try {
      const results = await discoverMovies({
        genre: filters.genre ? parseInt(filters.genre) : undefined,
        year: filters.year ? parseInt(filters.year) : undefined,
        minRating: filters.minRating ? parseFloat(filters.minRating) : undefined,
      });
      setFilteredResults(results);
    } catch (error) {
      console.error('Filter error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({ genre: '', year: '', minRating: '' });
    setFilteredResults([]);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const results = await searchContents(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayedContents = filteredResults.length > 0
    ? filteredResults
    : query
    ? activeTab === 'all'
      ? [...searchResults.movies, ...searchResults.books]
      : activeTab === 'movies'
      ? searchResults.movies
      : searchResults.books
    : [];

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Search Hero */}
      <div className="relative pt-16 pb-12 overflow-hidden">
        {/* Background Images */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 grid grid-cols-3">
            <img src={movie2} alt="" className="w-full h-full object-cover" />
            <img src={library2} alt="" className="w-full h-full object-cover" />
            <img src={movie3} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Keşfet
          </h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Film veya kitap arayın..."
              className="w-full px-6 py-4 bg-gray-900 text-white border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent placeholder-gray-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors font-medium"
            >
              {loading ? 'Aranıyor...' : 'Ara'}
            </button>
          </form>

          {/* Filter Toggle Button */}
          <div className="mt-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>{showFilters ? 'Filtreleri Gizle' : 'Filtrele'}</span>
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <form onSubmit={handleFilterSubmit} className="mt-6 bg-gray-900 p-6 rounded-lg border border-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Genre Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tür</label>
                  <select
                    value={filters.genre}
                    onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    <option value="">Tümü</option>
                    {genres.map((genre) => (
                      <option key={genre.id} value={genre.id}>
                        {genre.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Yıl</label>
                  <input
                    type="number"
                    value={filters.year}
                    onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                    placeholder="Örn: 2024"
                    min="1900"
                    max={new Date().getFullYear()}
                    className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 placeholder-gray-500"
                  />
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Puan</label>
                  <input
                    type="number"
                    value={filters.minRating}
                    onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
                    placeholder="Örn: 7.5"
                    min="0"
                    max="10"
                    step="0.1"
                    className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex space-x-4 mt-6">
                <button
                  type="submit"
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
                >
                  Uygula
                </button>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors font-medium"
                >
                  Temizle
                </button>
              </div>
            </form>
          )}

          {/* Tabs */}
          {query && (
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'all'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Tümü ({searchResults.movies.length + searchResults.books.length})
              </button>
              <button
                onClick={() => setActiveTab('movies')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'movies'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Filmler ({searchResults.movies.length})
              </button>
              <button
                onClick={() => setActiveTab('books')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'books'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Kitaplar ({searchResults.books.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredResults.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              Filtre Sonuçları
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredResults.map((content) => (
                <ContentCard key={`${content.type}-${content.id}`} content={content} />
              ))}
            </div>
          </div>
        ) : query ? (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              Arama Sonuçları
            </h2>
            {displayedContents.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {displayedContents.map((content) => (
                  <ContentCard key={`${content.type}-${content.id}`} content={content} />
                ))}
              </div>
            ) : loading ? (
              <p className="text-gray-400">Aranıyor...</p>
            ) : (
              <p className="text-gray-400">Sonuç bulunamadı.</p>
            )}
          </div>
        ) : (
          <>
            {/* Sliders */}
            {trending.length > 0 && (
              <ContentSlider title="🔥 Trend Filmler" contents={trending} />
            )}

            {popular.length > 0 && (
              <ContentSlider title="🎬 En Popüler" contents={popular} />
            )}

            {topRated.length > 0 && (
              <ContentSlider title="⭐ En Yüksek Puanlılar" contents={topRated} />
            )}

          </>
        )}
      </main>
    </div>
  );
};

export default Search;
