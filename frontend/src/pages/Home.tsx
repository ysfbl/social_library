import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFeed } from '../services/feed.service';
import { getTrendingMovies, getMostPopularOnPlatform, getTopRatedOnPlatform } from '../services/content.service';
import type { Activity, Content } from '../types';
import ActivityCard from '../components/ActivityCard';
import ContentSlider from '../components/ContentSlider';
import Navbar from '../components/Navbar';
import movie1 from '../assets/movie1.jpg';
import library1 from '../assets/library1.jpg';

const Home = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [trending, setTrending] = useState<Content[]>([]);
  const [popular, setPopular] = useState<Content[]>([]);
  const [topRated, setTopRated] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeSection, setActiveSection] = useState<'discover' | 'feed'>('discover');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [feedResponse, trendingData, popularData, topRatedData]: any = await Promise.all([
        getFeed(1, 15),
        getTrendingMovies(),
        getMostPopularOnPlatform(undefined, 20),
        getTopRatedOnPlatform(undefined, 20),
      ]);

      setActivities(feedResponse.data || feedResponse);
      setHasMore(feedResponse.hasMore !== undefined ? feedResponse.hasMore : false);
      setPage(1);

      const validTrending = trendingData.filter((c: Content) => c.id !== undefined && c.id !== null);
      const validPopular = popularData.filter((c: Content) => c.id !== undefined && c.id !== null);
      const validTopRated = topRatedData.filter((c: Content) => c.id !== undefined && c.id !== null);

      setTrending(validTrending.slice(0, 20));
      setPopular(validPopular);
      setTopRated(validTopRated);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreActivities = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const response: any = await getFeed(nextPage, 15);
      const newActivities = response.data || response;

      setActivities((prev) => [...prev, ...newActivities]);
      setHasMore(response.hasMore !== undefined ? response.hasMore : false);
      setPage(nextPage);
    } catch (error) {
      console.error('Error loading more activities:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative h-[70vh] overflow-hidden">
        {/* Background Images */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 flex">
            <img src={movie1} alt="" className="w-1/2 h-full object-cover" />
            <img src={library1} alt="" className="w-1/2 h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent"></div>
        </div>

        <div className="relative h-full flex items-end pb-20 px-4 md:px-8 lg:px-16">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
              Hoş Geldiniz
            </h1>
            <p className="text-lg md:text-xl text-gray-100 drop-shadow-lg mb-8 max-w-xl">
              Filmleri ve kitapları keşfedin, değerlendirin ve favori içeriklerinizi paylaşın
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveSection('discover')}
                className="px-8 py-3 bg-white text-black rounded hover:bg-gray-200 font-semibold transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                </svg>
                <span>Keşfet</span>
              </button>
              <button
                onClick={() => setActiveSection('feed')}
                className="px-8 py-3 bg-gray-600/80 text-white rounded hover:bg-gray-600 font-semibold transition-colors"
              >
                Aktivite Akışı
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section Toggle */}
      <div className="border-b border-gray-800 sticky top-16 bg-black/95 backdrop-blur-sm z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveSection('discover')}
              className={`py-4 px-2 font-semibold transition-colors border-b-2 ${
                activeSection === 'discover'
                  ? 'text-white border-red-600'
                  : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              Keşfet
            </button>
            <button
              onClick={() => setActiveSection('feed')}
              className={`py-4 px-2 font-semibold transition-colors border-b-2 ${
                activeSection === 'feed'
                  ? 'text-white border-red-600'
                  : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              Aktivite Akışı
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-white text-lg">Yükleniyor...</div>
          </div>
        ) : activeSection === 'discover' ? (
          <div>
            <ContentSlider title="🔥 Trend Filmler" contents={trending} />
            <ContentSlider title="⭐ En Yüksek Puanlılar" contents={topRated} />
            <ContentSlider title="🎬 En Popüler" contents={popular} />
          </div>
        ) : activities.length > 0 ? (
          <>
            <div className="max-w-4xl mx-auto px-4 md:px-8">
              <div className="space-y-4">
                {activities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={loadMoreActivities}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loadingMore ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Yükleniyor...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      <span>Daha Fazla Yükle</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {!hasMore && activities.length > 0 && (
              <div className="mt-8 text-center">
                <p className="text-gray-500 text-sm">Tüm aktiviteler yüklendi</p>
              </div>
            )}
          </>
        ) : (
          <div className="bg-gray-900 rounded-lg p-12 text-center border border-gray-800">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-semibold text-white mb-3">
              Aktivite Akışınız Boş
            </h3>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Henüz kimseyi takip etmiyorsunuz. Kullanıcıları keşfetmek için film veya kitap aramaya başlayın,
              yorumları okuyun ve ilginizi çeken kullanıcıları takip edin!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/search')}
                className="px-8 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors"
              >
                İçerik Keşfet
              </button>
            </div>

            {/* How it works */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-black/50 rounded-lg p-6 border border-gray-800">
                <div className="text-3xl mb-3">🎬</div>
                <h4 className="text-white font-semibold mb-2">1. Film/Kitap Ara</h4>
                <p className="text-gray-400 text-sm">
                  Keşfet sayfasından ilginizi çeken film veya kitapları arayın
                </p>
              </div>
              <div className="bg-black/50 rounded-lg p-6 border border-gray-800">
                <div className="text-3xl mb-3">💬</div>
                <h4 className="text-white font-semibold mb-2">2. Yorumları İncele</h4>
                <p className="text-gray-400 text-sm">
                  Detay sayfasında diğer kullanıcıların yorumlarını okuyun
                </p>
              </div>
              <div className="bg-black/50 rounded-lg p-6 border border-gray-800">
                <div className="text-3xl mb-3">👥</div>
                <h4 className="text-white font-semibold mb-2">3. Takip Et</h4>
                <p className="text-gray-400 text-sm">
                  Beğendiğiniz kullanıcıların profiline gidip takip edin
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
