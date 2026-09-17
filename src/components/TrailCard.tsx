import React from 'react';
import { Clock, MapPin, TrendingUp, Heart, Star, Bus, Car, Dog, ArrowRight, Play } from 'lucide-react';
import { Trail } from '../types';

interface TrailCardProps {
  trail: Trail;
  isSelected: boolean;
  isBookmarked: boolean;
  onSelect: (trail: Trail) => void;
  onToggleBookmark: (trailId: string, e: React.MouseEvent) => void;
  onOpenDetail: (trail: Trail) => void;
  distanceFromUser?: number | null; // in km
}

export const TrailCard: React.FC<TrailCardProps> = ({
  trail,
  isSelected,
  isBookmarked,
  onSelect,
  onToggleBookmark,
  onOpenDetail,
  distanceFromUser,
}) => {
  const getDifficultyBadge = () => {
    switch (trail.difficulty) {
      case 'easy':
        return {
          label: '쉬움 (초급)',
          classes: 'bg-emerald-100/90 text-emerald-800 border-emerald-200',
        };
      case 'moderate':
        return {
          label: '보통 (중급)',
          classes: 'bg-amber-100/90 text-amber-800 border-amber-200',
        };
      case 'hard':
        return {
          label: '도전 (상급)',
          classes: 'bg-rose-100/90 text-rose-800 border-rose-200',
        };
    }
  };

  const badge = getDifficultyBadge();

  // Format duration
  const hours = Math.floor(trail.durationMinutes / 60);
  const minutes = trail.durationMinutes % 60;
  const durationText = hours > 0 ? `${hours}시간 ${minutes > 0 ? `${minutes}분` : ''}` : `${minutes}분`;

  return (
    <div
      id={`trail-card-${trail.id}`}
      onClick={() => onSelect(trail)}
      className={`group relative bg-white rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col ${
        isSelected
          ? 'border-emerald-600 ring-2 ring-emerald-600/20 shadow-md'
          : 'border-stone-200 hover:border-stone-300 hover:shadow-md'
      }`}
    >
      {/* Card Image Header */}
      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-stone-100">
        <img
          src={trail.coverImage}
          alt={trail.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Region & Difficulty Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 text-stone-800 shadow-xs backdrop-blur-xs flex items-center gap-1">
            <MapPin className="w-3 h-3 text-stone-500" />
            {trail.regionName}
          </span>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-xs shadow-xs ${badge.classes}`}
          >
            {badge.label}
          </span>
          {trail.youtubeVideoId && (
            <span
              className="px-2 py-1 rounded-full text-xs font-bold bg-rose-600/90 text-white shadow-xs backdrop-blur-xs flex items-center gap-1"
              title="현장 영상 가이드 수록"
            >
              <Play className="w-2.5 h-2.5 fill-white text-white" />
              <span>영상 수록</span>
            </span>
          )}
        </div>

        {/* Bookmark Button */}
        <button
          type="button"
          onClick={(e) => onToggleBookmark(trail.id, e)}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-stone-700 hover:text-rose-500 backdrop-blur-xs shadow-xs transition-colors"
          title={isBookmarked ? '저장 취소' : '코스 저장'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isBookmarked ? 'fill-rose-500 text-rose-500' : 'text-stone-600'
            }`}
          />
        </button>

        {/* Mountain Area & Distance from user overlay at bottom of photo */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <span className="font-medium drop-shadow-sm text-stone-200">{trail.mountainOrArea}</span>
          {distanceFromUser != null && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-700/85 backdrop-blur-xs font-semibold">
              내 위치에서 {distanceFromUser.toFixed(1)}km
            </span>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Rating */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-base sm:text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
              {trail.name}
            </h3>
            <div className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{trail.rating.toFixed(1)}</span>
              <span className="text-stone-400 font-normal">({trail.reviewCount})</span>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 mb-3 leading-relaxed">
            {trail.subtitle}
          </p>

          {/* Metrics Grid (Distance, Duration, Elevation) */}
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-stone-50 rounded-xl border border-stone-100 text-stone-700 text-xs mb-3">
            <div className="flex flex-col">
              <span className="text-stone-400 text-[11px]">총 거리</span>
              <span className="font-bold text-stone-900 text-sm mt-0.5">{trail.distanceKm} km</span>
            </div>
            <div className="flex flex-col border-l border-stone-200 pl-2">
              <span className="text-stone-400 text-[11px]">소요 시간</span>
              <span className="font-bold text-stone-900 text-sm mt-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3 text-stone-400" />
                {durationText}
              </span>
            </div>
            <div className="flex flex-col border-l border-stone-200 pl-2">
              <span className="text-stone-400 text-[11px]">상승 고도</span>
              <span className="font-bold text-stone-900 text-sm mt-0.5 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-stone-400" />
                +{trail.elevationGainM}m
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {trail.tags.slice(0, 4).map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-600"
              >
                #{tag}
              </span>
            ))}
            {trail.tags.length > 4 && (
              <span className="text-[11px] text-stone-400 px-1 py-0.5">
                +{trail.tags.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Footer info: facilities and CTA */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-stone-400">
            {trail.facilities.publicTransit && (
              <span title="대중교통 접근 편리" className="text-stone-600 flex items-center">
                <Bus className="w-3.5 h-3.5" />
              </span>
            )}
            {trail.facilities.parking && (
              <span title="주차장 완비" className="text-stone-600 flex items-center">
                <Car className="w-3.5 h-3.5" />
              </span>
            )}
            {trail.facilities.petFriendly && (
              <span title="반려견 동반 가능" className="text-emerald-700 flex items-center">
                <Dog className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail(trail);
            }}
            className="flex items-center gap-1 font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
          >
            <span>상세 코스 보기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
