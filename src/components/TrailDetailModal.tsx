import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  TrendingUp,
  Heart,
  Share2,
  Navigation,
  Bus,
  Car,
  CheckCircle2,
  AlertTriangle,
  Droplets,
  Footprints,
  Sun,
  ShieldCheck,
  Compass,
  Play,
  ExternalLink,
} from 'lucide-react';
import { Trail } from '../types';
import { ReviewSection } from './ReviewSection';

interface TrailDetailModalProps {
  trail: Trail | null;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (trailId: string) => void;
}

export const TrailDetailModal: React.FC<TrailDetailModalProps> = ({
  trail,
  isOpen,
  onClose,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [copied, setCopied] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  if (!isOpen || !trail) return null;

  const hours = Math.floor(trail.durationMinutes / 60);
  const minutes = trail.durationMinutes % 60;
  const durationText = hours > 0 ? `${hours}시간 ${minutes > 0 ? `${minutes}분` : ''}` : `${minutes}분`;

  // Dynamic packing list calculation based on duration & elevation
  const recommendedWaterLiters = (trail.durationMinutes / 60 * 0.4).toFixed(1);
  const needsHikingPoles = trail.elevationGainM > 250 || trail.distanceKm > 7;
  const needsGripShoes = trail.difficulty !== 'easy' || trail.elevationGainM > 200;

  const packingList = [
    { id: 'water', label: `수분 섭취용 생수/이온음료 최소 ${recommendedWaterLiters}L 이상`, required: true },
    { id: 'shoes', label: needsGripShoes ? '접지력이 좋은 등산화 또는 트래킹화' : '발이 편안한 워킹화/러닝화', required: true },
    { id: 'poles', label: needsHikingPoles ? '무릎 하중을 줄여줄 등산 스틱 (권장)' : '경량 등산 스틱 (선택)', required: needsHikingPoles },
    { id: 'sun', label: '모자, 자외선 차단제, 선글라스', required: true },
    { id: 'wind', label: '고산/능선 바람막이 또는 경량 방풍 자켓', required: trail.maxElevationM > 500 },
    { id: 'snacks', label: '열량 보충용 행동식 (초콜릿, 견과류, 에너지바)', required: trail.durationMinutes > 90 },
    { id: 'trash', label: 'LNT 실천을 위한 쓰레기 수거용 친환경 봉투', required: true },
  ];

  const handleToggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = async () => {
    const text = `[트레일파인더] ${trail.name} (${trail.regionName})\n- 코스: ${trail.courseRoute}\n- 총거리: ${trail.distanceKm}km (약 ${durationText})\n- 난이도: ${trail.difficulty === 'easy' ? '쉬움' : trail.difficulty === 'moderate' ? '보통' : '도전'}`;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Elevation SVG Path calculation
  const maxElev = Math.max(...trail.elevationProfile.map((p) => p.elevationM), trail.maxElevationM || 100);
  const minElev = Math.min(...trail.elevationProfile.map((p) => p.elevationM), 0);
  const elevRange = maxElev - minElev || 1;
  const svgWidth = 500;
  const svgHeight = 140;
  const maxDist = trail.distanceKm || 1;

  const points = trail.elevationProfile.map((pt) => {
    const x = (pt.distanceKm / maxDist) * (svgWidth - 40) + 20;
    const y = svgHeight - 30 - ((pt.elevationM - minElev) / elevRange) * (svgHeight - 60);
    return `${x},${y}`;
  });

  const areaPoints = [
    `20,${svgHeight - 20}`,
    ...points,
    `${svgWidth - 20},${svgHeight - 20}`,
  ].join(' ');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div
        id="trail-detail-modal"
        className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col border border-stone-200"
      >
        {/* Modal Header Image */}
        <div className="relative h-60 sm:h-72 w-full shrink-0 bg-stone-900">
          <img
            src={trail.coverImage}
            alt={trail.name}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Top Actions */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition"
              title="코스 정보 복사"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => onToggleBookmark(trail.id)}
              className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition"
              title="북마크"
            >
              <Heart
                className={`w-5 h-5 ${isBookmarked ? 'fill-rose-500 text-rose-500' : 'text-white'}`}
              />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition"
              title="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Header Title Overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-600/90 text-white">
                {trail.regionName}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md">
                {trail.mountainOrArea}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md">
                추천 계절: {trail.bestSeason.join(', ')}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">{trail.name}</h2>
            <p className="text-xs sm:text-sm text-stone-200 mt-1 line-clamp-1">{trail.subtitle}</p>
          </div>
        </div>

        {/* Copy confirmation toast */}
        {copied && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-4 py-2 rounded-xl text-xs font-medium shadow-lg flex items-center gap-1.5 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>코스 정보가 클립보드에 복사되었습니다!</span>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6 flex-1 text-stone-800">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80">
              <span className="text-xs text-stone-500 font-medium">총 거리</span>
              <p className="text-lg font-bold text-stone-900 mt-0.5">{trail.distanceKm} km</p>
            </div>
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80">
              <span className="text-xs text-stone-500 font-medium">예상 시간</span>
              <p className="text-lg font-bold text-stone-900 mt-0.5 flex items-center gap-1">
                <Clock className="w-4 h-4 text-stone-400" />
                {durationText}
              </p>
            </div>
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80">
              <span className="text-xs text-stone-500 font-medium">상승 고도</span>
              <p className="text-lg font-bold text-stone-900 mt-0.5 flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-stone-400" />
                +{trail.elevationGainM}m
              </p>
            </div>
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80">
              <span className="text-xs text-stone-500 font-medium">최고 고도</span>
              <p className="text-lg font-bold text-stone-900 mt-0.5">해발 {trail.maxElevationM}m</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-stone-900 mb-2">코스 소개</h3>
            <p className="text-sm text-stone-600 leading-relaxed">{trail.description}</p>
          </div>

          {/* YouTube Video Tour Section */}
          {trail.youtubeVideoId && (
            <div className="bg-stone-900 text-white rounded-3xl p-4 sm:p-6 border border-stone-800 shadow-xl space-y-3.5">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-md shrink-0">
                    <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        유튜브 현장 생생 가이드
                      </span>
                      {trail.youtubeChannel && (
                        <span className="text-xs text-stone-400 font-medium">
                          채널: {trail.youtubeChannel}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-white mt-1">
                      {trail.youtubeVideoTitle || '트래킹 코스 현장 영상'}
                    </h4>
                  </div>
                </div>
                {trail.youtubeUrl && (
                  <a
                    href={trail.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-stone-300 hover:text-white flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition font-semibold"
                  >
                    <span>YouTube 원본 시청</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* 16:9 Responsive Embedded Player */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-stone-800 shadow-inner">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${trail.youtubeVideoId}?rel=0&modestbranding=1`}
                  title={trail.youtubeVideoTitle || '트래킹 현장 영상'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>

              <p className="text-xs text-stone-400 leading-relaxed">
                💡 실제 코스의 경사도, 풍경, 보행 노면 상태 및 대중교통 이용 팁을 영상으로 생생하게 미리 확인해 보세요.
              </p>
            </div>
          )}

          {/* Course Timeline / Route Flow */}
          <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200/80">
            <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-emerald-700" />
              <span>주요 경유 코스 안내</span>
            </h3>
            <div className="relative pl-6 border-l-2 border-emerald-600 space-y-4 my-2 text-xs">
              {trail.waypoints.map((wp, index) => (
                <div key={index} className="relative group">
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 text-sm">
                      {index + 1}. {wp.name}
                    </span>
                    <span className="ml-2 text-[11px] text-stone-500 font-medium">
                      (해발 {wp.altitude}m)
                    </span>
                    <p className="text-stone-600 mt-0.5 text-xs leading-relaxed">{wp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Elevation Profile Chart */}
          {trail.elevationProfile.length > 0 && (
            <div className="bg-white p-4 rounded-2xl border border-stone-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-700" />
                  <span>고도 변화 프로필 (Elevation Profile)</span>
                </h3>
                <span className="text-xs text-stone-500">
                  최고 {trail.maxElevationM}m / 최저 {minElev}m
                </span>
              </div>
              <div className="w-full overflow-hidden">
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-32">
                  <defs>
                    <linearGradient id="elevGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#059669" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#059669" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  {/* Grid Lines */}
                  <line x1="20" y1={svgHeight - 20} x2={svgWidth - 20} y2={svgHeight - 20} stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="20" y1="20" x2={svgWidth - 20} y2="20" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />
                  
                  {/* Filled area */}
                  <polygon points={areaPoints} fill="url(#elevGradient)" />
                  {/* Curve Line */}
                  <polyline points={points.join(' ')} fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Start & End Labels */}
                  <text x="20" y={svgHeight - 5} fontSize="10" fill="#6b7280">0km (시작)</text>
                  <text x={svgWidth - 20} y={svgHeight - 5} textAnchor="end" fontSize="10" fill="#6b7280">{trail.distanceKm}km (도착)</text>
                </svg>
              </div>
            </div>
          )}

          {/* Transit & Parking Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
              <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5 mb-1.5">
                <Bus className="w-4 h-4 text-emerald-700" />
                <span>대중교통 이용 안내</span>
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">{trail.transitInfo}</p>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
              <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5 mb-1.5">
                <Car className="w-4 h-4 text-emerald-700" />
                <span>주차 및 도로 정보</span>
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">{trail.parkingInfo}</p>
            </div>
          </div>

          {/* Smart Packing Checklist */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/60">
            <h3 className="text-sm font-bold text-emerald-950 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>이 코스를 위한 맞춤 준비물 체크리스트</span>
            </h3>
            <p className="text-xs text-stone-600 mb-3">
              거리({trail.distanceKm}km)와 소요 시간({durationText})을 고려한 권장 장비입니다.
            </p>
            <div className="space-y-2">
              {packingList.map((item) => {
                const isChecked = !!checkedItems[item.id];
                return (
                  <label
                    key={item.id}
                    className={`flex items-center gap-2.5 p-2 rounded-xl transition cursor-pointer text-xs ${
                      isChecked ? 'bg-emerald-100/70 text-emerald-900' : 'bg-white text-stone-700 hover:bg-emerald-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleCheck(item.id)}
                      className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <span className={isChecked ? 'line-through text-stone-500' : 'font-medium'}>
                      {item.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Tips from Trail Master */}
          {trail.tips.length > 0 && (
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
              <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>현지 탐방 꿀팁 & 주의사항</span>
              </h4>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-stone-600">
                {trail.tips.map((tip, idx) => (
                  <li key={idx} className="leading-relaxed">{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* User Reviews & Ratings Section */}
          <ReviewSection trail={trail} />
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-white border-t border-stone-200 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onToggleBookmark(trail.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-sm font-semibold transition ${
              isBookmarked
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{isBookmarked ? '저장됨' : '코스 저장'}</span>
          </button>

          <div className="flex items-center gap-2">
            <a
              href={`https://map.kakao.com/link/to/${encodeURIComponent(trail.name)},${trail.startPoint.lat},${trail.startPoint.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-900 text-sm font-semibold transition"
            >
              <Navigation className="w-4 h-4" />
              <span>카카오맵 길찾기</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold transition"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
