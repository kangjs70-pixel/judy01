import React, { useState } from 'react';
import { Play, ChevronDown, ChevronUp, ExternalLink, MapPin, Clock, Footprints, Sparkles, Compass } from 'lucide-react';
import { Trail } from '../types';

interface FeaturedVideoSectionProps {
  trail?: Trail;
  onOpenDetail: (trail: Trail) => void;
  onSelectTrail?: (trail: Trail) => void;
}

export const FeaturedVideoSection: React.FC<FeaturedVideoSectionProps> = ({
  trail,
  onOpenDetail,
  onSelectTrail,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  if (!trail || !trail.youtubeVideoId) return null;

  return (
    <section className="bg-gradient-to-br from-stone-900 via-stone-850 to-emerald-950 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-stone-800/90 overflow-hidden relative">
      {/* Subtle background ambient blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header Bar */}
      <div className="relative z-10 flex items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-900/30 shrink-0">
            <Play className="w-5 h-5 fill-white text-white ml-0.5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-rose-400" />
                추천 트래킹 영상 탐방
              </span>
              <span className="text-xs text-stone-400 font-medium">
                채널: {trail.youtubeChannel || '임기자가간다'}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-stone-100 mt-1 line-clamp-1">
              {trail.youtubeVideoTitle || '단연코 사찰 둘레길 중 최고! 걷기 좋은 사찰 트레킹 코스'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
            aria-expanded={isExpanded}
          >
            <span>{isExpanded ? '접기' : '영상 보기'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Body */}
      {isExpanded && (
        <div className="relative z-10 pt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center animate-fade-in">
          {/* Left Column: Responsive 16:9 Video Player */}
          <div className="lg:col-span-7">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-stone-700/60 ring-1 ring-white/10">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${trail.youtubeVideoId}?rel=0&modestbranding=1`}
                title={trail.youtubeVideoTitle || '트래킹 영상 가이드'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-stone-400 px-1">
              <span>▶ 실제 코스 보행 영상과 대중교통 이용 안내가 포함되어 있습니다.</span>
              {trail.youtubeUrl && (
                <a
                  href={trail.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-stone-300 hover:text-white flex items-center gap-1 font-medium transition"
                >
                  <span>YouTube 원본</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Featured Trail Context & Quick Action */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-stone-800/70 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-stone-700/60 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{trail.regionName} · {trail.mountainOrArea}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
                  난이도: 쉬움 (초급)
                </span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {trail.name}
                </h3>
                <p className="text-xs text-stone-300 mt-1 leading-relaxed line-clamp-2">
                  {trail.description}
                </p>
              </div>

              {/* Metrics Strip */}
              <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-stone-900/80 rounded-xl border border-stone-800 text-stone-300 text-xs">
                <div>
                  <span className="text-[11px] text-stone-400 block">총 거리</span>
                  <span className="font-bold text-white text-sm mt-0.5">{trail.distanceKm} km</span>
                </div>
                <div className="border-l border-stone-800 pl-2">
                  <span className="text-[11px] text-stone-400 block">소요 시간</span>
                  <span className="font-bold text-white text-sm mt-0.5">약 1시간 45분</span>
                </div>
                <div className="border-l border-stone-800 pl-2">
                  <span className="text-[11px] text-stone-400 block">상승 고도</span>
                  <span className="font-bold text-white text-sm mt-0.5">+{trail.elevationGainM}m</span>
                </div>
              </div>

              {/* Key Highlights */}
              <div className="space-y-1.5 pt-1 text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span><strong>코스 경로:</strong> 마곡사 주차장 ➔ 마곡천 데크길 ➔ 대웅보전 ➔ 백범명상길 ➔ 은적암</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span><strong>특징:</strong> 유네스코 세계유산, 태화산 울창한 소나무 숲길과 시원한 계곡 물소리</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span><strong>교통:</strong> 공주 시내버스 770번으로 주차장까지 직결 (뚜벅이 당일치기 추천)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (onSelectTrail) onSelectTrail(trail);
                    onOpenDetail(trail);
                  }}
                  className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-1.5"
                >
                  <Footprints className="w-4 h-4" />
                  <span>코스 상세 & 지도 보기</span>
                </button>
                {trail.youtubeUrl && (
                  <a
                    href={trail.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 bg-stone-700/80 hover:bg-stone-700 text-stone-200 hover:text-white rounded-xl text-xs font-semibold transition flex items-center gap-1"
                  >
                    <span>유튜브</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
