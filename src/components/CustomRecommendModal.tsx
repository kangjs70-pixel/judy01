import React, { useState, useMemo } from 'react';
import {
  X,
  Sliders,
  Sparkles,
  CheckCircle2,
  Clock,
  TrendingUp,
  MapPin,
  ChevronRight,
  ArrowRight,
  Compass,
  Filter,
  Check,
} from 'lucide-react';
import { Trail, TrailDifficulty, LandscapeType, Region } from '../types';

interface CustomRecommendModalProps {
  isOpen: boolean;
  onClose: () => void;
  allTrails: Trail[];
  onOpenDetail: (trail: Trail) => void;
  onSelectTrail: (trail: Trail) => void;
  onApplyFilters?: (filters: {
    difficulty: 'all' | TrailDifficulty;
    theme: string;
    maxDistanceKm: number;
    region?: Region;
  }) => void;
}

interface LandscapeOption {
  id: LandscapeType;
  label: string;
  emoji: string;
  desc: string;
  keywords: string[];
}

const REGION_OPTIONS: { id: Region; label: string }[] = [
  { id: 'all', label: '전국 전체' },
  { id: 'seoul', label: '서울' },
  { id: 'gyeonggi', label: '경기' },
  { id: 'gangwon', label: '강원' },
  { id: 'chungcheong', label: '충청' },
  { id: 'jeolla', label: '전라' },
  { id: 'gyeongsang', label: '경상' },
  { id: 'jeju', label: '제주' },
];

const LANDSCAPE_OPTIONS: LandscapeOption[] = [
  {
    id: 'mountain',
    label: '산 / 봉우리 조망',
    emoji: '⛰️',
    desc: '탁 트인 능선과 파노라마 산세',
    keywords: ['산', '능선', '봉우리', '고산', '바위'],
  },
  {
    id: 'forest',
    label: '숲 / 피톤치드',
    emoji: '🌲',
    desc: '울창한 전나무·자작나무 숲길',
    keywords: ['숲', '피톤치드', '힐링', '원시림', '나무'],
  },
  {
    id: 'river',
    label: '강 / 호수 / 습지',
    emoji: '🌊',
    desc: '잔잔한 물결과 갈대 수변길',
    keywords: ['강', '호수', '갈대', '습지', '수변'],
  },
  {
    id: 'coast',
    label: '바다 / 해안 절벽',
    emoji: '🏖️',
    desc: '푸른 바다와 파도 소리 절경',
    keywords: ['바다', '해안', '올레', '절벽', '파도'],
  },
  {
    id: 'valley',
    label: '계곡 / 시원한 폭포',
    emoji: '💧',
    desc: '맑은 물소리와 기암괴석',
    keywords: ['계곡', '폭포', '물소리', '단풍'],
  },
  {
    id: 'heritage',
    label: '성곽 / 역사 사찰',
    emoji: '🏯',
    desc: '천년 고찰과 옛 성곽길',
    keywords: ['성곽', '사찰', '역사', '문화', '옛길'],
  },
];

const DIFFICULTY_OPTIONS: { id: 'all' | TrailDifficulty; label: string; desc: string }[] = [
  { id: 'all', label: '전체 (상관없음)', desc: '난이도에 제한을 두지 않음' },
  { id: 'easy', label: '초급 (쉬움)', desc: '완만한 경사, 흙길·데크 위주로 부담 없는 산책' },
  { id: 'moderate', label: '중급 (보통)', desc: '적당한 오르막과 숲길이 있는 2~4시간 하이킹' },
  { id: 'hard', label: '상급 (도전)', desc: '암릉 구간, 가파른 경사 또는 고산 종주' },
];

const DISTANCE_OPTIONS = [
  { id: 'all', label: '전체 거리', desc: '거리 제한 없음' },
  { id: 'under5', label: '5km 미만', desc: '1~2시간 가벼운 산책' },
  { id: '5to10', label: '5km ~ 10km', desc: '2~3시간 기분 좋은 반나절 걷기' },
  { id: '10to15', label: '10km ~ 15km', desc: '3~5시간 본격적인 트래킹' },
  { id: 'over15', label: '15km 이상', desc: '5시간 이상 장거리 힐링 종주' },
];

export const CustomRecommendModal: React.FC<CustomRecommendModalProps> = ({
  isOpen,
  onClose,
  allTrails,
  onOpenDetail,
  onSelectTrail,
  onApplyFilters,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<Region>('all');
  const [difficulty, setDifficulty] = useState<'all' | TrailDifficulty>('all');
  const [distanceRange, setDistanceRange] = useState<string>('all');
  const [selectedLandscapes, setSelectedLandscapes] = useState<LandscapeType[]>([
    'forest',
    'valley',
  ]);

  if (!isOpen) return null;

  const handleToggleLandscape = (id: LandscapeType) => {
    setSelectedLandscapes((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((item) => item !== id) : prev) : [...prev, id]
    );
  };

  // Match Scoring Algorithm
  const matchResults = useMemo(() => {
    return allTrails
      .filter((trail) => {
        if (selectedRegion === 'all') return true;
        const matchesPrimary = trail.region === selectedRegion;
        const matchesMulti = trail.regions && trail.regions.includes(selectedRegion);
        const matchesText = (
          (selectedRegion === 'seoul' && (trail.regionName.includes('서울') || trail.region === 'seoul')) ||
          (selectedRegion === 'gyeonggi' && (trail.regionName.includes('경기') || trail.region === 'gyeonggi')) ||
          (selectedRegion === 'gangwon' && (trail.regionName.includes('강원') || trail.region === 'gangwon')) ||
          (selectedRegion === 'chungcheong' && (trail.regionName.includes('충청') || trail.regionName.includes('충북') || trail.regionName.includes('충남') || trail.region === 'chungcheong')) ||
          (selectedRegion === 'jeolla' && (trail.regionName.includes('전라') || trail.regionName.includes('전북') || trail.regionName.includes('전남') || trail.region === 'jeolla')) ||
          (selectedRegion === 'gyeongsang' && (trail.regionName.includes('경상') || trail.regionName.includes('경북') || trail.regionName.includes('경남') || trail.regionName.includes('부산') || trail.regionName.includes('울산') || trail.region === 'gyeongsang')) ||
          (selectedRegion === 'jeju' && (trail.regionName.includes('제주') || trail.region === 'jeju'))
        );
        return matchesPrimary || matchesMulti || matchesText;
      })
      .map((trail) => {
        let score = 0;
        const matchReasons: string[] = [];

        // Region match bonus/note
        if (selectedRegion !== 'all') {
          matchReasons.push(`희망 지역(${trail.regionName})`);
        }

        // 1. Difficulty score (max 35)
        if (difficulty === 'all') {
          score += 35;
        } else if (trail.difficulty === difficulty) {
          score += 35;
          matchReasons.push(`선호 난이도(${difficulty === 'easy' ? '초급' : difficulty === 'moderate' ? '중급' : '상급'}) 일치`);
        } else if (
          (difficulty === 'moderate' && (trail.difficulty === 'easy' || trail.difficulty === 'hard')) ||
          (difficulty === 'easy' && trail.difficulty === 'moderate')
        ) {
          score += 15;
        }

        // 2. Distance score (max 35)
        if (distanceRange === 'all') {
          score += 35;
        } else if (distanceRange === 'under5') {
          if (trail.distanceKm <= 5.0) {
            score += 35;
            matchReasons.push('5km 미만 산책 코스');
          } else if (trail.distanceKm <= 6.5) {
            score += 20;
          }
        } else if (distanceRange === '5to10') {
          if (trail.distanceKm >= 4.5 && trail.distanceKm <= 10.0) {
            score += 35;
            matchReasons.push('5~10km 반나절 코스');
          } else if (trail.distanceKm <= 11.5) {
            score += 20;
          }
        } else if (distanceRange === '10to15') {
          if (trail.distanceKm >= 9.0 && trail.distanceKm <= 15.0) {
            score += 35;
            matchReasons.push('10~15km 본격 트래킹');
          } else if (trail.distanceKm <= 17.0) {
            score += 20;
          }
        } else if (distanceRange === 'over15') {
          if (trail.distanceKm >= 14.0) {
            score += 35;
            matchReasons.push('15km 이상 장거리 코스');
          } else {
            score += 15;
          }
        }

        // 3. Landscape score (max 30)
        let landscapeScore = 0;
        const matchedLandscapes: string[] = [];

        selectedLandscapes.forEach((sceneryId) => {
          const scenery = LANDSCAPE_OPTIONS.find((s) => s.id === sceneryId);
          if (!scenery) return;

          const isMatch = scenery.keywords.some(
            (kw) =>
              trail.tags.some((t) => t.includes(kw)) ||
              trail.name.includes(kw) ||
              trail.subtitle.includes(kw) ||
              trail.description.includes(kw) ||
              trail.mountainOrArea.includes(kw)
          );

          if (isMatch) {
            landscapeScore += 30 / selectedLandscapes.length;
            matchedLandscapes.push(scenery.label.split('/')[0].trim());
          }
        });

        score += Math.min(30, Math.round(landscapeScore));
        if (matchedLandscapes.length > 0) {
          matchReasons.push(`풍경 [${matchedLandscapes.join(', ')}] 일치`);
        }

        return {
          trail,
          matchScore: Math.min(100, Math.round(score)),
          matchReasons,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [allTrails, selectedRegion, difficulty, distanceRange, selectedLandscapes]);

  const topMatches = matchResults.slice(0, 5);

  const handleApplyToMain = () => {
    if (onApplyFilters) {
      const activeScenery = LANDSCAPE_OPTIONS.find((s) => selectedLandscapes.includes(s.id));
      onApplyFilters({
        difficulty,
        theme: activeScenery ? activeScenery.keywords[0] : '전체',
        region: selectedRegion,
        maxDistanceKm:
          distanceRange === 'under5'
            ? 5
            : distanceRange === '5to10'
            ? 10
            : distanceRange === '10to15'
            ? 15
            : 50,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div
        id="custom-recommend-modal"
        className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col border border-stone-200 text-stone-900"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-teal-800 to-emerald-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Sliders className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">맞춤 트래킹 코스 추천</h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                  취향 맞춤 매칭
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                선호하는 난이도, 거리, 풍경과 희망 지역을 선택하면 최적의 코스를 찾아드립니다.
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

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* STEP 0: Target Region Selection */}
          <div className="space-y-2 pb-1 border-b border-stone-100">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-extrabold">
                  <MapPin className="w-3 h-3 text-emerald-700" />
                </span>
                <span>희망 지역을 선택해 주세요 (지역 일치 필수)</span>
              </label>
              <span className="text-[11px] text-stone-400">
                {selectedRegion === 'all' ? '전국 코스 탐색' : `${REGION_OPTIONS.find(r => r.id === selectedRegion)?.label} 코스만 추천`}
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {REGION_OPTIONS.map((reg) => {
                const isSelected = selectedRegion === reg.id;
                return (
                  <button
                    key={reg.id}
                    type="button"
                    onClick={() => setSelectedRegion(reg.id)}
                    className={`px-3 py-1.5 rounded-xl border font-semibold text-xs transition ${
                      isSelected
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    {reg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 1: Difficulty */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-extrabold">
                  1
                </span>
                <span>선호하는 난이도를 선택해 주세요</span>
              </label>
              <span className="text-[11px] text-stone-400">현재 체력 상태에 맞춤</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DIFFICULTY_OPTIONS.map((opt) => {
                const isSelected = difficulty === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDifficulty(opt.id)}
                    className={`p-3 rounded-2xl border text-left transition ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/20 text-stone-900'
                        : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">{opt.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />}
                    </div>
                    <p className="text-[10px] text-stone-500 line-clamp-2 leading-tight">
                      {opt.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Distance */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-extrabold">
                  2
                </span>
                <span>희망하는 트래킹 거리를 선택해 주세요</span>
              </label>
              <span className="text-[11px] text-stone-400">총 걷는 코스 길이</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {DISTANCE_OPTIONS.map((opt) => {
                const isSelected = distanceRange === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDistanceRange(opt.id)}
                    className={`p-3 rounded-2xl border text-left transition ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/20 text-stone-900'
                        : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">{opt.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />}
                    </div>
                    <p className="text-[10px] text-stone-500 line-clamp-2 leading-tight">
                      {opt.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: Landscape / Scenery */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-extrabold">
                  3
                </span>
                <span>선호하는 풍경을 선택해 주세요 (중복 선택 가능)</span>
              </label>
              <span className="text-[11px] text-emerald-700 font-semibold">
                {selectedLandscapes.length}개 선택됨
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {LANDSCAPE_OPTIONS.map((scenery) => {
                const isSelected = selectedLandscapes.includes(scenery.id);
                return (
                  <button
                    key={scenery.id}
                    type="button"
                    onClick={() => handleToggleLandscape(scenery.id)}
                    className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 ${
                      isSelected
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-white border-stone-200 hover:border-stone-300 text-stone-800'
                    }`}
                  >
                    <span className="text-2xl">{scenery.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-xs block truncate">{scenery.label}</span>
                      <span
                        className={`text-[10px] block truncate ${
                          isSelected ? 'text-emerald-100' : 'text-stone-500'
                        }`}
                      >
                        {scenery.desc}
                      </span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-200 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Matching Results Header */}
          <div className="pt-2 border-t border-stone-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>선택 조건에 가장 잘 맞는 맞춤 코스 TOP {topMatches.length}</span>
              </h4>
              <button
                type="button"
                onClick={handleApplyToMain}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>메인 화면 필터에 바로 적용</span>
              </button>
            </div>

            {/* Matched Trails Cards */}
            <div className="space-y-3">
              {topMatches.map(({ trail, matchScore, matchReasons }, idx) => {
                const hours = Math.floor(trail.durationMinutes / 60);
                const minutes = trail.durationMinutes % 60;
                const durationStr =
                  hours > 0 ? `${hours}시간 ${minutes > 0 ? `${minutes}분` : ''}` : `${minutes}분`;

                return (
                  <div
                    key={trail.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      idx === 0
                        ? 'bg-emerald-50/50 border-emerald-300 shadow-xs'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Left: Info */}
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                            {matchScore}% 일치
                          </span>
                          <span className="text-xs text-stone-500">{trail.regionName}</span>
                          <span className="text-xs text-stone-300">&bull;</span>
                          <span className="text-xs font-semibold text-stone-700">
                            {trail.mountainOrArea}
                          </span>
                        </div>

                        <h5 className="text-sm font-bold text-stone-900">{trail.name}</h5>
                        <p className="text-xs text-stone-600 leading-relaxed">
                          {trail.subtitle}
                        </p>

                        {/* Why Matched Badge */}
                        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                          {matchReasons.map((r, rIdx) => (
                            <span
                              key={rIdx}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-medium"
                            >
                              ✓ {r}
                            </span>
                          ))}
                        </div>

                        {/* Meta: Duration, Distance, Difficulty */}
                        <div className="flex items-center gap-4 text-xs text-stone-600 pt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-emerald-700" />
                            <span>약 {durationStr}</span>
                          </span>
                          <span>&bull;</span>
                          <span>거리 {trail.distanceKm}km</span>
                          <span>&bull;</span>
                          <span className="font-semibold text-emerald-800">
                            {trail.difficulty === 'easy'
                              ? '초급 (쉬움)'
                              : trail.difficulty === 'moderate'
                              ? '중급 (보통)'
                              : '상급 (도전)'}
                          </span>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                        <img
                          src={trail.coverImage}
                          alt={trail.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-stone-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            onOpenDetail(trail);
                            onClose();
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition flex items-center gap-1 shadow-xs"
                        >
                          <span>코스 상세 & 리뷰</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-stone-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handleApplyToMain}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>이 조건으로 메인 목록 탐색하기</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
