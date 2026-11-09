import { useState, useRef } from 'react';
import ContentCard from './ContentCard';
import type { Content } from '../types';

interface ContentSliderProps {
  title: string;
  contents: Content[];
}

const ContentSlider = ({ title, contents }: ContentSliderProps) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;

    const scrollAmount = sliderRef.current.clientWidth * 0.8;
    const newPosition = direction === 'left'
      ? scrollPosition - scrollAmount
      : scrollPosition + scrollAmount;

    sliderRef.current.scrollTo({
      left: newPosition,
      behavior: 'smooth',
    });

    setScrollPosition(newPosition);
  };

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = sliderRef.current
    ? scrollPosition < (sliderRef.current.scrollWidth - sliderRef.current.clientWidth - 10)
    : true;

  if (contents.length === 0) return null;

  return (
    <div className="relative group/slider mb-12">
      {/* Title */}
      <h2 className="text-2xl font-bold text-white mb-4 px-4 md:px-8">{title}</h2>

      {/* Left Arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/80 text-white p-3 rounded-r-md opacity-0 group-hover/slider:opacity-100 hover:bg-black transition-all duration-300 hidden md:block"
          aria-label="Scroll left"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Slider */}
      <div
        ref={sliderRef}
        className="flex space-x-3 overflow-x-auto scrollbar-hide px-4 md:px-8 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {contents.map((content) => (
          <div key={content.id} className="flex-none w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px]">
            <ContentCard content={content} />
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/80 text-white p-3 rounded-l-md opacity-0 group-hover/slider:opacity-100 hover:bg-black transition-all duration-300 hidden md:block"
          aria-label="Scroll right"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ContentSlider;
