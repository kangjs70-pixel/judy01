import React, { useState, useMemo } from 'react';
import {
  X,
  MapPin,
  Clock,
  TrendingUp,
  Navigation,
  Compass,
  ArrowRight,
  Sparkles,
  Check,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Trail } from '../types';

interface NearbyTrailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  trails: Trail[];
  userLocation: { lat: number; lng: number } | null;
  onGetNearMe: () => void;
  isLocating: boolean;
  onSelectTrail: (trail: Trail) => void;
  onOpenDetail: (trail: Trail) => void;
  onSetCustomLocation?: (lat: number, lng: number, name: string) => void;
}

// Preset locations for quick testing or when GPS is unavailable
const LOCATION_PRESETS = [
  { name: '서울 시청', lat: 37.5665, lng: 126.9780 },
  { name: '경기 수원', lat: 37.2636, lng: 127.0286 },
  { name: '강원 평창/강릉', lat: 37.7518, lng: 128.8760 },
  { name: '충북 괴산/대전', lat: 36.3504, lng: 127.3845 },
  { name: '전남 순천/광주', lat: 35.1595, lng: 126.8526 },
  { name: '부산 해운대', lat: 35.1587, lng: 129.1604 },
  { name: '울산 영남알프스', lat: 35.5384, lng: 129.3114 },
  { name: '제주 서귀포', lat: 33.2541, lng: 126.5601 },
];

function getDistanceFromLatLng(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const DIFFICULTY_MAP = {
  easy: { label: '초급 (쉬움)', desc: '경사가 완만하여 초보자·가족도 편안히 걸을 수 있는 길', badge: 'bg-emerald-100 text-emerald-800' },
  moderate: { label: '중급 (보통)', desc: '적당한 오르막과 숲길이 있는 2~4시간 하이킹 코스', badge: 'bg-blue-100 text-blue-800' },
  hard: { label: '상급 (도전)', desc: '암릉과 고도차가 있어 등산 장비가 필요한 도전 코스', badge: 'bg-amber-100 text-amber-800' },
};

export const NearbyTrailsModal: React.FC<NearbyTrailsModalProps> = ({
  isOpen,
  onClose,
  trails,
  userLocation,
  onGetNearMe,
  isLocating,
  onSelectTrail,
  onOpenDetail,
  onSetCustomLocation,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [useGpsMode, setUseGpsMode] = useState<boolean>(false);

  // Active reference coordinate (GPS location or selected preset)
  const activeCoord = useMemo(() => {
    // If user explicitly clicked a region preset, prioritize that preset
    if (selectedPreset) {
      const found = LOCATION_PRESETS.find((p) => p.name === selectedPreset);
      if (found) {
        return { lat: found.lat, lng: found.lng };
      }
    }
    // If GPS mode is on and user location is available
    if (useGpsMode && userLocation) {
      return userLocation;
    }
    // Fallback to userLocation or default Seoul preset
    if (userLocation) return userLocation;
    const defaultPreset = LOCATION_PRESETS[0]; // Seoul default
    return { lat: defaultPreset.lat, lng: defaultPreset.lng };
  }, [selectedPreset, useGpsMode, userLocation]);

  // Calculate distances and rank top nearby trails
  const rankedTrails = useMemo(() => {
    return trails
      .map((trail) => {
        const dist = getDistanceFromLatLng(
          activeCoord.lat,
          activeCoord.lng,
          trail.startPoint.lat,
          trail.startPoint.lng
        );
        return {
          trail,
          distanceKm: dist,
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [trails, activeCoord]);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: typeof LOCATION_PRESETS[0]) => {
    setUseGpsMode(false);
    setSelectedPreset(preset.name);
    if (onSetCustomLocation) {
      onSetCustomLocation(preset.lat, preset.lng, preset.name);
    }
  };

  const handleNearMeClick = () => {
    setSelectedPreset(null);
    setUseGpsMode(true);
    onGetNearMe();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div
        id="nearby-trails-modal"
        className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col border border-stone-200 text-stone-900"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-800 to-stone-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700/80 flex items-center justify-center border border-emerald-500/30">
              <Navigation className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">내 주변 인기 트래킹 장소 추천</h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                  거리순 정렬
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                현재 계신 위치에서 가장 가깝고 평점이 높은 명품 둘레길과 산책로입니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Location Status & Presets Bar */}
        <div className="p-4 bg-stone-100/80 border-b border-stone-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-stone-700">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              기준 위치:{' '}
              <strong className="text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md font-bold">
                {selectedPreset
                  ? `${selectedPreset} 기준`
                  : useGpsMode && userLocation
                  ? '내 현재 GPS 위치'
                  : userLocation
                  ? 'GPS 위치'
                  : '서울 중심권'}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleNearMeClick}
              disabled={isLocating}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold shadow-xs disabled:opacity-50 transition ${
                !selectedPreset && useGpsMode
                  ? 'bg-emerald-800 text-white ring-2 ring-emerald-500'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white'
              }`}
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'GPS 위치 확인 중...' : '내 GPS 위치 갱신'}</span>
            </button>
          </div>
        </div>

        {/* Quick Region Selector (When user is in another city) */}
        <div className="px-5 py-2.5 bg-stone-50 border-b border-stone-200/80 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-stone-500 shrink-0 font-medium">지역 빠른 선택:</span>
          {LOCATION_PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition border ${
                selectedPreset === p.name
                  ? 'bg-emerald-800 text-white border-emerald-800 font-semibold'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-emerald-300'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Body: Recommended Trails List */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>주변 추천 트래킹 코스 {rankedTrails.length}곳</span>
            <span>직선 거리 기준</span>
          </div>

          <div className="space-y-3.5">
            {rankedTrails.map(({ trail, distanceKm }, idx) => {
              const diff = DIFFICULTY_MAP[trail.difficulty];
              const hours = Math.floor(trail.durationMinutes / 60);
              const minutes = trail.durationMinutes % 60;
              const durationStr =
                hours > 0 ? `${hours}시간 ${minutes > 0 ? `${minutes}분` : ''}` : `${minutes}분`;

              return (
                <div
                  key={trail.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    idx === 0
                      ? 'bg-emerald-50/40 border-emerald-300 shadow-xs'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    {/* Left: Info */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {idx === 0 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-600 text-white">
                            가장 가까운 코스
                          </span>
                        )}
                        <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>약 {distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m` : `${distanceKm.toFixed(1)}km`} 거리</span>
                        </span>
                        <span className="text-xs text-stone-400">&bull;</span>
                        <span className="text-xs text-stone-600 font-medium">{trail.regionName}</span>
                      </div>

                      <h4 className="text-base font-bold text-stone-900 hover:text-emerald-800 transition">
                        {trail.name}
                      </h4>

                      {/* Brief Description */}
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {trail.description.slice(0, 110)}...
                      </p>

                      {/* Key Meta: Duration, Difficulty, Distance */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-xs">
                        {/* Estimated Duration */}
                        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-stone-50 border border-stone-200/70">
                          <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                          <div>
                            <span className="text-[10px] text-stone-400 block leading-tight">예상 소요 시간</span>
                            <span className="font-bold text-stone-800">{durationStr} ({trail.distanceKm}km)</span>
                          </div>
                        </div>

                        {/* Difficulty Info */}
                        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-stone-50 border border-stone-200/70 sm:col-span-2">
                          <TrendingUp className="w-4 h-4 text-emerald-700 shrink-0" />
                          <div>
                            <span className="text-[10px] text-stone-400 block leading-tight">난이도 정보</span>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`text-[11px] font-bold px-1.5 py-0.2 rounded-md ${diff.badge}`}>
                                {diff.label}
                              </span>
                              <span className="text-[11px] text-stone-600">{diff.desc}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {trail.tags.slice(0, 4).map((t, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right: Cover & Action Buttons */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-2.5 shrink-0 pt-2 sm:pt-0">
                      <img
                        src={trail.coverImage}
                        alt={trail.name}
                        className="w-20 h-20 sm:w-28 sm:h-24 rounded-xl object-cover shadow-xs border border-stone-200"
                      />
                      <div className="flex flex-col gap-1.5 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => {
                            onOpenDetail(trail);
                            onClose();
                          }}
                          className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition flex items-center justify-center gap-1 shadow-xs"
                        >
                          <span>상세 정보 & 리뷰</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onSelectTrail(trail);
                            onClose();
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 transition text-center"
                        >
                          지도에서 보기
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-stone-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-stone-500 hidden sm:inline">
            * 코스 시작점까지의 실제 도로/대중교통 이동 시간은 상세 정보를 참조하세요.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition ml-auto"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
