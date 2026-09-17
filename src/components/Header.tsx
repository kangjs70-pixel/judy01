import React from 'react';
import { Compass, Sparkles, Heart, Navigation, MapPin, Sliders } from 'lucide-react';

interface HeaderProps {
  onOpenAI: () => void;
  onOpenNearby: () => void;
  onOpenCustomRecommend: () => void;
  bookmarkCount: number;
  onOpenBookmarks: () => void;
  onGetNearMe: () => void;
  isLocating: boolean;
  activeTab: 'all' | 'bookmarks';
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAI,
  onOpenNearby,
  onOpenCustomRecommend,
  bookmarkCount,
  onOpenBookmarks,
  onGetNearMe,
  isLocating,
  activeTab,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-sm shadow-emerald-900/10">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-stone-900">트레일파인더</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                TrailFinder
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">
              대한민국 최고의 트래킹 코스 & 둘레길 탐색
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Nearby Trails Button */}
          <button
            id="btn-nearby-trails"
            type="button"
            onClick={onOpenNearby}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors shadow-2xs"
            title="현재 위치 기반 주변 인기 트래킹 장소 추천"
          >
            <Navigation className="w-4 h-4 text-emerald-700" />
            <span>내 주변 추천</span>
          </button>

          {/* Custom Matcher Button (Difficulty, Distance, Landscape) */}
          <button
            id="btn-custom-recommend"
            type="button"
            onClick={onOpenCustomRecommend}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl text-stone-800 bg-stone-100 hover:bg-stone-200 transition-colors"
            title="난이도·거리·선호 풍경 맞춤 추천"
          >
            <Sliders className="w-4 h-4 text-stone-600" />
            <span className="hidden md:inline">맞춤 코스 찾기</span>
            <span className="md:hidden">맞춤 추천</span>
          </button>

          {/* Bookmarks Toggle */}
          <button
            id="btn-bookmarks"
            type="button"
            onClick={onOpenBookmarks}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl transition-colors border ${
              activeTab === 'bookmarks'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${activeTab === 'bookmarks' ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`} />
            <span className="hidden sm:inline">저장한 코스</span>
            {bookmarkCount > 0 && (
              <span className="px-1.5 py-0.2 text-[11px] rounded-full bg-rose-500 text-white font-semibold">
                {bookmarkCount}
              </span>
            )}
          </button>

          {/* AI Recommendation Button */}
          <button
            id="btn-ai-recommend"
            type="button"
            onClick={onOpenAI}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 transition shadow-xs hover:shadow-sm active:scale-98"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span className="hidden sm:inline">AI 큐레이터</span>
            <span className="sm:hidden">AI</span>
          </button>
        </div>
      </div>
    </header>
  );
};
