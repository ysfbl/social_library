import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { getMovieDetails, getBookDetails } from '../services/content.service';
import { createOrUpdateRating, getUserRatingForContent } from '../services/rating.service';
import { createReview, getReviewsForContent, updateReview, deleteReview, likeReview, unlikeReview } from '../services/review.service';
import { createReply, getRepliesForReview, deleteReply as deleteReplyService, likeReply as likeReplyService, unlikeReply as unlikeReplyService } from '../services/reply.service';
import { addToLibrary, getUserCustomLists, addToCustomList } from '../services/library.service';
import type { Content, Review, Reply, List } from '../types';
import { ContentType, ListType } from '../types';
import Navbar from '../components/Navbar';
import Avatar from '../components/Avatar';

const ContentDetail = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [content, setContent] = useState<Content | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [editingReview, setEditingReview] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [customLists, setCustomLists] = useState<List[]>([]);
  const [showCustomListMenu, setShowCustomListMenu] = useState(false);

  // Reply states
  const [replies, setReplies] = useState<{ [key: number]: Reply[] }>({});
  const [showReplies, setShowReplies] = useState<{ [key: number]: boolean }>({});
  const [replyText, setReplyText] = useState<{ [key: number]: string }>({});
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  useEffect(() => {
    loadContentData();
    if (user) {
      loadCustomLists();
    }
  }, [type, id, user]);

  const loadContentData = async () => {
    if (!type || !id) return;

    setLoading(true);
    try {
      let contentData;
      if (type === 'movie') {
        contentData = await getMovieDetails(parseInt(id));
      } else {
        contentData = await getBookDetails(id);
      }

      console.log('Content Data:', contentData);

      if (!contentData) {
        toast.error('İçerik bulunamadı');
        setLoading(false);
        return;
      }

      setContent(contentData);

      // Only fetch ratings and reviews if we have a valid database ID
      if (contentData.id) {
        try {
          const rating = await getUserRatingForContent(contentData.id as number);
          if (rating) {
            setUserRating(rating.rating);
          }
        } catch (err) {
          console.error('Error loading rating:', err);
        }

        try {
          const reviewsData = await getReviewsForContent(contentData.id as number);
          setReviews(reviewsData.data || []);
        } catch (err) {
          console.error('Error loading reviews:', err);
        }
      }
    } catch (error: any) {
      console.error('Error loading content:', error);
      toast.error(error.response?.data?.message || 'İçerik yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (rating: number) => {
    if (!content) return;
    try {
      await createOrUpdateRating(content.id as number, rating);
      setUserRating(rating);
      toast.success(`${rating}/10 puan verildi!`);
    } catch (error) {
      console.error('Error rating content:', error);
      toast.error('Puanlama başarısız');
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content || !reviewText.trim()) return;

    try {
      if (editingReview) {
        await updateReview(editingReview, reviewText);
        toast.success('Yorum güncellendi!');
        setEditingReview(null);
      } else {
        await createReview(content.id as number, reviewText);
        toast.success('Yorum eklendi!');
      }
      setReviewText('');
      loadContentData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Yorum eklenemedi');
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm('Yorumu silmek istediğinize emin misiniz?')) return;
    try {
      await deleteReview(reviewId);
      toast.success('Yorum silindi!');
      loadContentData();
    } catch (error) {
      toast.error('Yorum silinemedi');
    }
  };

  const handleLikeToggle = async (reviewId: number, isLiked: boolean) => {
    if (!user) {
      toast.error('Beğenmek için giriş yapmalısınız');
      return;
    }

    try {
      if (isLiked) {
        await unlikeReview(reviewId);
      } else {
        await likeReview(reviewId);
      }

      // Update the review in the local state
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                is_liked_by_user: !isLiked,
                like_count: isLiked
                  ? parseInt(review.like_count?.toString() || '0') - 1
                  : parseInt(review.like_count?.toString() || '0') + 1,
              }
            : review
        )
      );
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  // Load replies for a review
  const loadReplies = async (reviewId: number) => {
    try {
      const fetchedReplies = await getRepliesForReview(reviewId);
      setReplies((prev) => ({ ...prev, [reviewId]: fetchedReplies }));
    } catch (error) {
      toast.error('Yanıtlar yüklenemedi');
    }
  };

  // Toggle replies visibility
  const toggleReplies = async (reviewId: number) => {
    if (!showReplies[reviewId]) {
      await loadReplies(reviewId);
    }
    setShowReplies((prev) => ({ ...prev, [reviewId]: !prev[reviewId] }));
  };

  // Handle reply submit
  const handleReplySubmit = async (reviewId: number) => {
    if (!user) {
      toast.error('Yanıt yazmak için giriş yapmalısınız');
      return;
    }

    const text = replyText[reviewId]?.trim();
    if (!text) return;

    try {
      await createReply(reviewId, text);
      toast.success('Yanıt eklendi!');
      setReplyText((prev) => ({ ...prev, [reviewId]: '' }));
      setReplyingTo(null);
      await loadReplies(reviewId);

      // Update reply count
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                reply_count: parseInt(review.reply_count?.toString() || '0') + 1,
              }
            : review
        )
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Yanıt eklenemedi');
    }
  };

  // Handle reply delete
  const handleDeleteReply = async (reviewId: number, replyId: number) => {
    if (!confirm('Yanıtı silmek istediğinize emin misiniz?')) return;

    try {
      await deleteReplyService(replyId);
      toast.success('Yanıt silindi!');
      await loadReplies(reviewId);

      // Update reply count
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                reply_count: Math.max(0, parseInt(review.reply_count?.toString() || '0') - 1),
              }
            : review
        )
      );
    } catch (error) {
      toast.error('Yanıt silinemedi');
    }
  };

  // Handle reply like toggle
  const handleReplyLikeToggle = async (reviewId: number, replyId: number, isLiked: boolean) => {
    if (!user) {
      toast.error('Beğenmek için giriş yapmalısınız');
      return;
    }

    try {
      if (isLiked) {
        await unlikeReplyService(replyId);
      } else {
        await likeReplyService(replyId);
      }

      // Update the reply in the local state
      setReplies((prevReplies) => ({
        ...prevReplies,
        [reviewId]: prevReplies[reviewId]?.map((reply) =>
          reply.id === replyId
            ? {
                ...reply,
                is_liked_by_user: !isLiked,
                like_count: isLiked
                  ? parseInt(reply.like_count?.toString() || '0') - 1
                  : parseInt(reply.like_count?.toString() || '0') + 1,
              }
            : reply
        ),
      }));
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const loadCustomLists = async () => {
    if (!user) return;
    try {
      const lists = await getUserCustomLists(user.id);
      setCustomLists(lists);
    } catch (error) {
      console.error('Error loading custom lists:', error);
    }
  };

  const handleAddToLibrary = async (listType: ListType) => {
    if (!content) return;
    try {
      await addToLibrary(listType, content.id as number);
      const listNames: Record<string, string> = {
        [ListType.WATCHED]: 'İzlenenler',
        [ListType.TO_WATCH]: 'İzlenecekler',
        [ListType.READ]: 'Okunanlar',
        [ListType.TO_READ]: 'Okunacaklar',
      };
      toast.success(`${listNames[listType]} listesine eklendi!`);
    } catch (error) {
      console.error('Error adding to library:', error);
      toast.error('Kütüphaneye eklenirken bir hata oluştu');
    }
  };

  const handleAddToCustomList = async (listId: number, listName: string) => {
    if (!content) return;
    try {
      await addToCustomList(listId, content.id as number);
      toast.success(`${listName} listesine eklendi!`);
      setShowCustomListMenu(false);
    } catch (error) {
      console.error('Error adding to custom list:', error);
      toast.error('Listeye eklenirken bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Yükleniyor...</div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">İçerik bulunamadı</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Hero Section with Backdrop */}
      <div className="relative pt-16">
        <div className="absolute inset-0 h-[600px]">
          {content.posterUrl && (
            <>
              <img
                src={content.posterUrl}
                alt={content.title}
                className="w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
            </>
          )}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Poster */}
            <div className="md:col-span-1">
              {content.posterUrl ? (
                <img
                  src={content.posterUrl}
                  alt={content.title}
                  className="w-full rounded-lg shadow-2xl"
                />
              ) : (
                <div className="w-full aspect-[2/3] bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Resim yok</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 space-y-2">
                {content.type === ContentType.MOVIE ? (
                  <>
                    <button
                      onClick={() => handleAddToLibrary(ListType.WATCHED)}
                      className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 font-medium transition-colors"
                    >
                      İzledim
                    </button>
                    <button
                      onClick={() => handleAddToLibrary(ListType.TO_WATCH)}
                      className="w-full bg-gray-700 text-white py-3 rounded-md hover:bg-gray-600 font-medium transition-colors"
                    >
                      İzlenecek
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleAddToLibrary(ListType.READ)}
                      className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 font-medium transition-colors"
                    >
                      Okudum
                    </button>
                    <button
                      onClick={() => handleAddToLibrary(ListType.TO_READ)}
                      className="w-full bg-gray-700 text-white py-3 rounded-md hover:bg-gray-600 font-medium transition-colors"
                    >
                      Okunacak
                    </button>
                  </>
                )}

                {/* Custom List Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowCustomListMenu(!showCustomListMenu)}
                    className="w-full bg-gray-800 text-white py-3 rounded-md hover:bg-gray-700 font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Özel Listeye Ekle</span>
                  </button>

                  {/* Custom List Dropdown */}
                  {showCustomListMenu && (
                    <div className="absolute z-10 mt-2 w-full bg-gray-800 rounded-md shadow-lg border border-gray-700 max-h-60 overflow-y-auto">
                      {customLists.length > 0 ? (
                        customLists.map((list) => (
                          <button
                            key={list.id}
                            onClick={() => handleAddToCustomList(list.id, list.name)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors text-white border-b border-gray-700 last:border-b-0"
                          >
                            <div className="font-medium">{list.name}</div>
                            {list.description && (
                              <div className="text-sm text-gray-400 mt-1">{list.description}</div>
                            )}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-400 text-sm">
                          Henüz özel liste oluşturmadınız
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="md:col-span-2">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{content.title}</h1>

              {/* Metadata Row */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {content.year && (
                  <span className="text-lg text-gray-400">{content.year}</span>
                )}

                {/* Movie-specific metadata */}
                {content.type === ContentType.MOVIE && content.metadata && (
                  <>
                    {content.metadata.runtime && (
                      <span className="text-lg text-gray-400">
                        {content.metadata.runtime} dk
                      </span>
                    )}
                    {content.metadata.genres && content.metadata.genres.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {content.metadata.genres.map((genre: any) => (
                          <span
                            key={genre.id}
                            className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* Book-specific metadata */}
                {content.type === ContentType.BOOK && content.metadata && (
                  <>
                    {content.metadata.pageCount && (
                      <span className="text-lg text-gray-400">
                        {content.metadata.pageCount} sayfa
                      </span>
                    )}
                    {content.metadata.categories && content.metadata.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {content.metadata.categories.map((category: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Rating Section - Enhanced */}
              <div className="mb-8 bg-gray-900/50 rounded-lg p-6 border border-gray-800">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Platform Rating */}
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Platform Puanı</p>
                    <div className="flex items-end space-x-3">
                      <p className="text-5xl font-bold text-yellow-400">
                        {content.average_rating ? parseFloat(content.average_rating.toString()).toFixed(1) : 'N/A'}
                      </p>
                      <p className="text-2xl text-gray-500 mb-1">/10</p>
                    </div>
                    {content.rating_count !== undefined && (
                      <p className="text-sm text-gray-500 mt-2">
                        {content.rating_count} kullanıcı değerlendirmesi
                      </p>
                    )}
                  </div>

                  {/* User Rating */}
                  <div>
                    <p className="text-sm text-gray-400 mb-2">
                      {userRating > 0 ? `Senin Puanın: ${userRating}/10` : 'Puan Ver'}
                    </p>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                        <button
                          key={star}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          onClick={() => handleRating(star)}
                          className="text-2xl focus:outline-none transition-all hover:scale-110"
                        >
                          <span className={star <= (hoveredRating || userRating) ? 'text-yellow-400' : 'text-gray-600'}>
                            {star <= (hoveredRating || userRating) ? '★' : '☆'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Credits Section */}
              {content.type === ContentType.MOVIE && content.metadata && (
                <>
                  {content.metadata.directors && content.metadata.directors.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-2">Yönetmen</h3>
                      <p className="text-gray-300">
                        {content.metadata.directors.map((d: any) => d.name).join(', ')}
                      </p>
                    </div>
                  )}
                  {content.metadata.cast && content.metadata.cast.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-2">Oyuncular</h3>
                      <p className="text-gray-300">
                        {content.metadata.cast.map((c: any) => c.name).join(', ')}
                      </p>
                    </div>
                  )}
                </>
              )}

              {content.type === ContentType.BOOK && content.metadata && content.metadata.authors && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Yazar</h3>
                  <p className="text-gray-300">
                    {Array.isArray(content.metadata.authors)
                      ? content.metadata.authors.join(', ')
                      : content.metadata.authors}
                  </p>
                </div>
              )}

              {content.type === ContentType.BOOK && content.metadata && content.metadata.publisher && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Yayıncı</h3>
                  <p className="text-gray-300">{content.metadata.publisher}</p>
                </div>
              )}

              {/* Description */}
              {content.description && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-3">Özet</h2>
                  <p className="text-gray-300 leading-relaxed">{content.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div>
          <h2 className="text-3xl font-bold text-white mb-6">Yorumlar</h2>

          {/* Add Review Form */}
          <form onSubmit={handleAddReview} className="mb-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Yorumunuzu yazın (en az 10 karakter)..."
              className="w-full px-4 py-3 bg-black text-white border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent placeholder-gray-500"
              rows={4}
            />
            <div className="mt-4 flex justify-end space-x-3">
              {editingReview && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingReview(null);
                    setReviewText('');
                  }}
                  className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  İptal
                </button>
              )}
              <button
                type="submit"
                disabled={reviewText.trim().length < 10}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                {editingReview ? 'Güncelle' : 'Yorum Yap'}
              </button>
            </div>
          </form>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                  <div className="flex items-start space-x-4">
                    {/* User Avatar */}
                    <Link to={`/profile/${review.user_id}`} className="flex-shrink-0">
                      <div className="cursor-pointer hover:opacity-80 transition-opacity">
                        <Avatar
                          avatar_id={review.avatar_id}
                          username={review.username}
                          size="md"
                        />
                      </div>
                    </Link>

                    {/* Review Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <Link
                            to={`/profile/${review.user_id}`}
                            className="font-semibold text-white text-lg hover:text-red-500 transition-colors"
                          >
                            {review.username}
                          </Link>
                          <p className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString('tr-TR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        {review.user_id === user?.id && (
                          <div className="flex space-x-3">
                            <button
                              onClick={() => {
                                setEditingReview(review.id);
                                setReviewText(review.text);
                              }}
                              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                            >
                              Düzenle
                            </button>
                            <button
                              onClick={() => handleDeleteReview(review.id)}
                              className="text-red-400 hover:text-red-300 text-sm font-medium"
                            >
                              Sil
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-300 leading-relaxed mb-4">{review.text}</p>

                      {/* Like and Reply Buttons */}
                      <div className="flex items-center space-x-6">
                        {/* Like Button */}
                        <button
                          onClick={() => handleLikeToggle(review.id, review.is_liked_by_user || false)}
                          className={`flex items-center space-x-2 transition-colors ${
                            review.is_liked_by_user
                              ? 'text-red-500 hover:text-red-400'
                              : 'text-gray-400 hover:text-red-500'
                          }`}
                        >
                          <svg
                            className="w-5 h-5"
                            fill={review.is_liked_by_user ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          <span className="text-sm font-medium">
                            {parseInt(review.like_count?.toString() || '0') > 0 && (
                              <span>{review.like_count}</span>
                            )}
                            {parseInt(review.like_count?.toString() || '0') === 0 && (
                              <span>Beğen</span>
                            )}
                          </span>
                        </button>

                        {/* Reply Button */}
                        <button
                          onClick={() => {
                            setReplyingTo(replyingTo === review.id ? null : review.id);
                            if (!showReplies[review.id]) {
                              toggleReplies(review.id);
                            }
                          }}
                          className="flex items-center space-x-2 text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          <span className="text-sm font-medium">
                            {parseInt(review.reply_count?.toString() || '0') > 0 ? (
                              <span>{review.reply_count} Yanıt</span>
                            ) : (
                              <span>Yanıtla</span>
                            )}
                          </span>
                        </button>

                        {/* View Replies Toggle */}
                        {parseInt(review.reply_count?.toString() || '0') > 0 && (
                          <button
                            onClick={() => toggleReplies(review.id)}
                            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                          >
                            {showReplies[review.id] ? 'Yanıtları Gizle' : 'Yanıtları Göster'}
                          </button>
                        )}
                      </div>

                      {/* Reply Input */}
                      {replyingTo === review.id && (
                        <div className="mt-4 pl-4 border-l-2 border-gray-700">
                          <div className="flex items-start space-x-3">
                            <Avatar
                              avatar_id={user?.avatar_id}
                              username={user?.username}
                              size="sm"
                            />
                            <div className="flex-1">
                              <textarea
                                value={replyText[review.id] || ''}
                                onChange={(e) =>
                                  setReplyText((prev) => ({ ...prev, [review.id]: e.target.value }))
                                }
                                placeholder="Yanıtınızı yazın..."
                                className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white text-sm focus:outline-none focus:border-red-500 resize-none"
                                rows={2}
                              />
                              <div className="flex justify-end mt-2 space-x-2">
                                <button
                                  onClick={() => setReplyingTo(null)}
                                  className="px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                  İptal
                                </button>
                                <button
                                  onClick={() => handleReplySubmit(review.id)}
                                  disabled={!replyText[review.id]?.trim()}
                                  className="px-4 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                                >
                                  Yanıtla
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Replies List */}
                      {showReplies[review.id] && replies[review.id] && replies[review.id].length > 0 && (
                        <div className="mt-4 space-y-3 pl-4 border-l-2 border-gray-700">
                          {replies[review.id].map((reply) => (
                            <div key={reply.id} className="bg-gray-800 p-4 rounded-lg">
                              <div className="flex items-start space-x-3">
                                <Link to={`/profile/${reply.user_id}`} className="flex-shrink-0">
                                  <Avatar
                                    avatar_id={reply.avatar_id}
                                    username={reply.username}
                                    size="sm"
                                  />
                                </Link>

                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <Link
                                        to={`/profile/${reply.user_id}`}
                                        className="font-semibold text-white hover:text-red-500 transition-colors text-sm"
                                      >
                                        {reply.username}
                                      </Link>
                                      <p className="text-xs text-gray-500">
                                        {new Date(reply.created_at).toLocaleDateString('tr-TR')}
                                      </p>
                                    </div>
                                    {reply.user_id === user?.id && (
                                      <button
                                        onClick={() => handleDeleteReply(review.id, reply.id)}
                                        className="text-red-400 hover:text-red-300 text-xs font-medium"
                                      >
                                        Sil
                                      </button>
                                    )}
                                  </div>

                                  <p className="text-gray-300 text-sm mb-2">{reply.text}</p>

                                  {/* Reply Like Button */}
                                  <button
                                    onClick={() => handleReplyLikeToggle(review.id, reply.id, reply.is_liked_by_user || false)}
                                    className={`flex items-center space-x-1 transition-colors text-xs ${
                                      reply.is_liked_by_user
                                        ? 'text-red-500 hover:text-red-400'
                                        : 'text-gray-400 hover:text-red-500'
                                    }`}
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill={reply.is_liked_by_user ? 'currentColor' : 'none'}
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                      />
                                    </svg>
                                    {parseInt(reply.like_count?.toString() || '0') > 0 && (
                                      <span className="font-medium">{reply.like_count}</span>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContentDetail;
