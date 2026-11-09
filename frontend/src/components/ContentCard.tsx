import { Link } from 'react-router-dom';
import type { Content } from '../types';
import { ContentType } from '../types';

interface ContentCardProps {
  content: Content;
}

const ContentCard = ({ content }: ContentCardProps) => {
  const displayYear = content.year || 'N/A';
  const displayRating = content.average_rating
    ? parseFloat(content.average_rating.toString()).toFixed(1)
    : content.rating
    ? content.rating.toFixed(1)
    : null;

  return (
    <Link
      to={`/content/${content.type}/${content.id}`}
      className="group block relative rounded-md overflow-hidden transition-all duration-300 hover:scale-110 hover:z-10 hover:shadow-2xl"
    >
      <div className="relative bg-gray-900" style={{ aspectRatio: '2/3' }}>
        {content.posterUrl ? (
          <img
            src={content.posterUrl}
            alt={content.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-bold text-white text-sm mb-1 line-clamp-2">
              {content.title}
            </h3>
            <div className="flex items-center justify-between text-xs text-gray-300">
              <span>{displayYear}</span>
              {displayRating && (
                <span className="flex items-center">
                  <span className="text-yellow-400 mr-1">★</span>
                  {displayRating}
                </span>
              )}
            </div>
            {content.rating_count !== undefined && content.rating_count > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                {content.rating_count} değerlendirme
              </p>
            )}
          </div>
        </div>

        {/* Type Badge */}
        <div className="absolute top-2 left-2 z-10">
          <span className={`px-2 py-1 text-xs font-bold rounded ${
            content.type === ContentType.MOVIE
              ? 'bg-blue-600 text-white'
              : 'bg-green-600 text-white'
          }`}>
            {content.type === ContentType.MOVIE ? 'FİLM' : 'KİTAP'}
          </span>
        </div>

        {/* Rating Badge */}
        {displayRating && (
          <div className="absolute top-2 right-2 bg-black/80 text-yellow-400 px-2 py-1 rounded text-xs font-bold backdrop-blur-sm z-10">
            ★ {displayRating}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ContentCard;
