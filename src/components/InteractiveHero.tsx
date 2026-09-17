import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  Compass,
  MapPin,
  Clock,
  TrendingUp,
  Navigation,
  Heart,
  ChevronRight,
  Flame,
  Footprints,
  Droplets,
  Shuffle,
  Search,
  Sliders,
  Sun,
  Wind,
  Check,
  ChevronDown,
  ChevronUp,
  Award,
  Zap,
} from 'lucide-react';
import { Trail, TrailDifficulty } from '../types';

interface InteractiveHeroProps {
  allTrails: Trail[];
  onSelectTrail: (trail: Trail) => void;
  onOpenDetail: (trail: Trail) => void;
  onToggleBookmark: (trailId: string) => void;
  bookmarkedTrailIds: string[];
  onOpenNearby: () => void;
  onOpenCustomRecommend: () => void;
  onOpenAI: () => void;
  onApplySearchQuery: (query: string) => void;
  onApplyFilterCriteria: (criteria: {
    difficulty?: 'all' | TrailDifficulty;
    theme?: string;
    searchQuery?: string;
  }) => void;
}

// Scenery Mood Definitions
interface MoodTheme {
  id: string;
  label: string;
  tagline: string;
  emoji: string;
  trailId: string;
  badge: string;
  bgGradient: string;
  tempWeather: {
    temp: string;
    weather: string;
    airScore: string;
    wind: string;
  };
}

const MOOD_THEMES: MoodTheme[] = [
  {
    id: 'forest',
    label: '피톤치드 숲길',
    tagline: '피톤치드 가득한 원시림과 시원한 나무 그늘',
    emoji: '🌲',
    trailId: 'odaesan-seonjaegil',
    badge: '청량한 숲속 힐링',
    bgGradient: 'from-emerald-950 via-stone-900 to-teal-950',
    tempWeather: { temp: '19°C', weather: '상쾌함', airScore: '최고 99점', wind: '1.2m/s 서풍' },
  },
  {
    id: 'coast',
    label: '에메랄드 바다',
    tagline: '파도 소리와 수평선 해안 절벽 비경',
    emoji: '🏖️',
    trailId: 'jeju-olle-7',
    badge: '탁 트인 오션뷰',
    bgGradient: 'from-cyan-950 via-stone-900 to-blue-950',
    tempWeather: { temp: '22°C', weather: '맑음', airScore: '청정 97점', wind: '2.5m/s 해풍' },
  },
  {
    id: 'ridge',
    label: '가을 억새 & 능선',
    tagline: '은빛 물결치는 억새평원과 360도 마운틴 파노라마',
    emoji: '⛰️',
    trailId: 'yeongnam-alps-ganwoljae',
    badge: '은빛 억새 절경',
    bgGradient: 'from-amber-950 via-stone-900 to-stone-950',
    tempWeather: { temp: '16°C', weather: '선선함', airScore: '매우 맑음', wind: '3.1m/s 산들바람' },
  },
  {
    id: 'valley',
    label: '맑은 계곡 & 폭포',
    tagline: '에메랄드빛 계곡물과 기암괴석 기행',
    emoji: '💧',
    trailId: 'seoraksan-jujeongol',
    badge: '청정 계곡물소리',
    bgGradient: 'from-teal-950 via-stone-900 to-emerald-950',
    tempWeather: { temp: '18°C', weather: '맑고 쾌적', airScore: '100점', wind: '1.0m/s 산바람' },
  },
  {
    id: 'heritage',
    label: '도심 성곽 & 야경',
    tagline: '조선 600년 성곽과 서울 파노라마 뷰포인트',
    emoji: '🏯',
    trailId: 'inwangsan-seoul-trail',
    badge: '일몰·야경 명소',
    bgGradient: 'from-indigo-950 via-stone-900 to-purple-950',
    tempWeather: { temp: '21°C', weather: '온화함', airScore: '보통 85점', wind: '1.4m/s' },
  },
  {
    id: 'subway',
    label: '수도권 전철 연결',
    tagline: '지하철역에서 도보로 바로 연결되는 호젓한 산책로',
    emoji: '🌿',
    trailId: 'bukhansan-uiryeong',
    badge: '대중교통 안심 코스',
    bgGradient: 'from-stone-900 via-stone-950 to-emerald-950',
    tempWeather: { temp: '20°C', weather: '구름조금', airScore: '쾌적 91점', wind: '1.1m/s' },
  },
  {
    id: 'temple',
    label: '천년사찰 솔바람길',
    tagline: '단연코 사찰 둘레길 최고! 유네스코 세계유산 마곡사 솔바람길 (현장 영상 가이드)',
    emoji: '🛕',
    trailId: 'gongju-magoksa-trail',
    badge: '▶ 현장 영상 수록',
    bgGradient: 'from-amber-950 via-stone-900 to-rose-950',
    tempWeather: { temp: '20°C', weather: '쾌적함', airScore: '청정 98점', wind: '1.2m/s 솔바람' },
  },
];

// Popular clickable hashtag filters
const HOT_TAGS = [
  { label: '초보자안심', query: '', difficulty: 'easy' as TrailDifficulty },
  { label: '바다조망', query: '바다' },
  { label: '피톤치드숲', query: '숲' },
  { label: '단풍명소', query: '단풍' },
  { label: '대중교통편한곳', query: '지하철' },
  { label: '가족동반', query: '가족' },
  { label: '일몰야경', query: '야경' },
];

export const InteractiveHero: React.FC<InteractiveHeroProps> = ({
  allTrails,
  onSelectTrail,
  onOpenDetail,
  onToggleBookmark,
  bookmarkedTrailIds,
  onOpenNearby,
  onOpenCustomRecommend,
  onOpenAI,
  onApplySearchQuery,
  onApplyFilterCriteria,
}) => {
  const [activeMoodId, setActiveMoodId] = useState<string>('forest');
  const [heroSearch, setHeroSearch] = useState<string>('');
  const [isRouletteSpinning, setIsRouletteSpinning] = useState<boolean>(false);
  const [rouletteResult, setRouletteResult] = useState<Trail | null>(null);
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Calorie & Activity Calculator States
  const [hikingHours, setHikingHours] = useState<number>(3.0);
  const [paceLevel, setPaceLevel] = useState<'easy' | 'moderate' | 'brisk'>('moderate');
  const [userWeightKg, setUserWeightKg] = useState<number>(65);

  // Active mood theme object
  const currentMood = useMemo(() => {
    return MOOD_THEMES.find((m) => m.id === activeMoodId) || MOOD_THEMES[0];
  }, [activeMoodId]);

  // Featured trail matching the active mood
  const featuredTrail = useMemo(() => {
    return (
      allTrails.find((t) => t.id === currentMood.trailId) ||
      allTrails[0]
    );
  }, [allTrails, currentMood]);

  const isBookmarked = bookmarkedTrailIds.includes(featuredTrail.id);

  // Real-time calculation for Activity Estimator
  const activityStats = useMemo(() => {
    // MET values: easy walk 3.5, moderate trail 5.3, brisk mountain hike 6.8
    const mets = paceLevel === 'easy' ? 3.5 : paceLevel === 'moderate' ? 5.3 : 6.8;
    const speedKmh = paceLevel === 'easy' ? 3.3 : paceLevel === 'moderate' ? 4.0 : 4.8;

    const estimatedDistance = +(speedKmh * hikingHours).toFixed(1);
    // Calories = MET * weight(kg) * hours
    const totalCalories = Math.round(mets * userWeightKg * hikingHours);
    // Steps ~ 1320 steps per km
    const estimatedSteps = Math.round(estimatedDistance * 1320);
    // Recommended hydration: ~350ml per hour of hiking
    const waterLiters = +(hikingHours * 0.35).toFixed(1);
    // Rice bowl equivalent (~300 kcal per bowl)
    const riceBowls = (totalCalories / 300).toFixed(1);

    // Find 2 trails that best match this target distance
    const matchedTrails = [...allTrails]
      .sort(
        (a, b) =>
          Math.abs(a.distanceKm - estimatedDistance) -
          Math.abs(b.distanceKm - estimatedDistance)
      )
      .slice(0, 3);

    return {
      estimatedDistance,
      totalCalories,
      estimatedSteps,
      waterLiters,
      riceBowls,
      matchedTrails,
    };
  }, [hikingHours, paceLevel, userWeightKg, allTrails]);

  // Interactive Roulette: pick random trail with spinning animation
  const handleSpinRoulette = () => {
    if (isRouletteSpinning) return;
    setIsRouletteSpinning(true);
    setRouletteResult(null);

    // Rapid flicker animation
    let count = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * MOOD_THEMES.length);
      setActiveMoodId(MOOD_THEMES[randomIndex].id);
      count++;
      if (count > 6) {
        clearInterval(interval);
        // Pick truly random trail from allTrails
        const chosen = allTrails[Math.floor(Math.random() * allTrails.length)];
        setRouletteResult(chosen);
        setIsRouletteSpinning(false);
      }
    }, 90);
  };

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      onApplySearchQuery(heroSearch.trim());
    }
  };

  const handleSelectHotTag = (tag: (typeof HOT_TAGS)[0]) => {
    if (tag.difficulty) {
      onApplyFilterCriteria({ difficulty: tag.difficulty, searchQuery: tag.query });
    } else {
      onApplySearchQuery(tag.query);
      setHeroSearch(tag.query);
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      {/* Compact Mini Bar Mode */}
      {isCollapsed ? (
        <div className="p-3.5 bg-gradient-to-r from-stone-900 to-emerald-950 text-white rounded-2xl flex items-center justify-between shadow-md border border-stone-800">
          <div className="flex items-center gap-3">
            <span className="text-xl">🌲</span>
            <div>
              <span className="text-xs font-bold text-emerald-300 block">
                전국 둘레길 & 트래킹 탐색기
              </span>
              <span className="text-[11px] text-stone-300">
                오늘의 추천 코스: <strong className="text-white">{featuredTrail.name}</strong> ({featuredTrail.regionName})
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenDetail(featuredTrail)}
              className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-xs font-semibold text-white transition"
            >
              코스 보기
            </button>
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition"
              title="인터랙티브 히어로 펼치기"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Full Interactive Hero Section */
        <div
          id="interactive-hero-section"
          className={`relative rounded-3xl overflow-hidden shadow-xl border border-stone-800/60 bg-gradient-to-br ${currentMood.bgGradient} text-white transition-all duration-500`}
        >
          {/* Subtle Ambient Background Image with Dark Vignette */}
          <div className="absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-700 mix-blend-luminosity">
            <img
              src={featuredTrail.coverImage}
              alt=""
              className="w-full h-full object-cover filter blur-[2px] scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-900/80 to-transparent pointer-events-none" />

          {/* Top Bar: Title, Interactive Tools & Collapse Control */}
          <div className="relative z-10 px-5 sm:px-7 pt-5 sm:pt-6 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>Interactive Trail Finder</span>
                </span>
                <span className="text-[11px] text-stone-400 hidden sm:inline">
                  대한민국 10대 명품 둘레길 실시간 가이드
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                <span>자연과 마주하는 시간,</span>
                <span className="text-emerald-400">어떤 길을 걷고 싶으신가요?</span>
              </h2>
            </div>

            {/* Quick Interactive Tool Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Random Roulette Button */}
              <button
                type="button"
                id="btn-hero-roulette"
                onClick={handleSpinRoulette}
                disabled={isRouletteSpinning}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 text-xs font-bold transition shadow-xs active:scale-95 disabled:opacity-50"
                title="오늘 걸을 코스를 무작위로 뽑아보세요!"
              >
                <Shuffle className={`w-3.5 h-3.5 ${isRouletteSpinning ? 'animate-spin' : ''}`} />
                <span>{isRouletteSpinning ? '코스 뽑는 중...' : '오늘 어디로 갈까? 🎲'}</span>
              </button>

              {/* Activity Calculator Expander Button */}
              <button
                type="button"
                id="btn-hero-calculator"
                onClick={() => setShowCalculator((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                  showCalculator
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-white/10 hover:bg-white/15 text-stone-200 border-white/15'
                }`}
                title="트래킹 예상 칼로리 및 걸음 수 계산기 열기"
              >
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span>칼로리 & 걸음 계산기</span>
                {showCalculator ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {/* Minimize Hero Button */}
              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition"
                title="히어로 섹션 접기"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Random Roulette Result Banner (Appears when triggered) */}
          {rouletteResult && (
            <div className="relative z-20 mx-5 sm:mx-7 mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/25 via-emerald-600/20 to-teal-500/20 border border-amber-400/40 text-white flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center gap-3">
                <span className="text-2xl animate-bounce">🍀</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-400 text-stone-950">
                      오늘의 행운 추천 코스
                    </span>
                    <strong className="text-sm font-bold text-amber-200">{rouletteResult.name}</strong>
                    <span className="text-xs text-stone-300">({rouletteResult.regionName})</span>
                  </div>
                  <p className="text-xs text-stone-200 mt-0.5">
                    {rouletteResult.subtitle} &bull; 거리 {rouletteResult.distanceKm}km &bull; 예상 {Math.round(rouletteResult.durationMinutes / 60)}시간 소요
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onOpenDetail(rouletteResult)}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs transition shadow-sm"
                >
                  상세 정보 확인
                </button>
                <button
                  type="button"
                  onClick={() => onSelectTrail(rouletteResult)}
                  className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs transition"
                >
                  지도 위치 보기
                </button>
                <button
                  type="button"
                  onClick={() => setRouletteResult(null)}
                  className="text-stone-400 hover:text-white text-xs px-1.5"
                >
                  닫기
                </button>
              </div>
            </div>
          )}

          {/* Interactive Activity & Calorie Estimator Drawer (Expandable) */}
          {showCalculator && (
            <div className="relative z-10 mx-5 sm:mx-7 mt-3 p-4 sm:p-5 rounded-2xl bg-stone-900/90 backdrop-blur-md border border-emerald-500/30 text-white space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <h4 className="text-sm font-bold">인터랙티브 트래킹 활동량 & 칼로리 소모 계산기</h4>
                </div>
                <span className="text-[11px] text-stone-400">
                  체중과 보행 시간에 따른 소모 칼로리 실시간 환산
                </span>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* 1. Time Slider */}
                <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700/60 space-y-2">
                  <div className="flex items-center justify-between text-stone-300">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>예상 걷기 시간</span>
                    </span>
                    <strong className="text-emerald-300 text-sm font-extrabold">{hikingHours}시간</strong>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    step="0.5"
                    value={hikingHours}
                    onChange={(e) => setHikingHours(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400">
                    <span>1시간 (가벼운 산책)</span>
                    <span>6시간 (종주)</span>
                  </div>
                </div>

                {/* 2. Pace Selector */}
                <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700/60 space-y-2">
                  <div className="flex items-center justify-between text-stone-300">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Footprints className="w-3.5 h-3.5 text-emerald-400" />
                      <span>보행 페이스</span>
                    </span>
                    <strong className="text-emerald-300 font-bold">
                      {paceLevel === 'easy' ? '편안한 산책' : paceLevel === 'moderate' ? '보통 트래킹' : '빠른 하이킹'}
                    </strong>
                  </div>
                  <div className="grid grid-cols-3 gap-1 pt-0.5">
                    {(['easy', 'moderate', 'brisk'] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPaceLevel(p)}
                        className={`py-1.5 px-1 rounded-lg text-center text-[11px] font-semibold transition ${
                          paceLevel === p
                            ? 'bg-emerald-700 text-white border border-emerald-500'
                            : 'bg-stone-700/60 text-stone-300 hover:bg-stone-700'
                        }`}
                      >
                        {p === 'easy' ? '산책(3.3k)' : p === 'moderate' ? '일반(4.0k)' : '등산(4.8k)'}
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-stone-400 block text-center">
                    지형 경사에 따른 완급 조절 반영
                  </span>
                </div>

                {/* 3. Weight Slider */}
                <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700/60 space-y-2">
                  <div className="flex items-center justify-between text-stone-300">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>체중 설정</span>
                    </span>
                    <strong className="text-amber-300 text-sm font-extrabold">{userWeightKg} kg</strong>
                  </div>
                  <input
                    type="range"
                    min="45"
                    max="95"
                    step="1"
                    value={userWeightKg}
                    onChange={(e) => setUserWeightKg(parseInt(e.target.value, 10))}
                    className="w-full accent-amber-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400">
                    <span>45 kg</span>
                    <span>70 kg</span>
                    <span>95 kg</span>
                  </div>
                </div>
              </div>

              {/* Calculated Activity Results & Recommended Trails */}
              <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto text-center md:text-left">
                  <div className="bg-white/5 p-2 rounded-lg">
                    <span className="text-[10px] text-stone-400 block">예상 거리</span>
                    <strong className="text-base font-extrabold text-emerald-300">
                      {activityStats.estimatedDistance} km
                    </strong>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg">
                    <span className="text-[10px] text-stone-400 block">총 소모 칼로리</span>
                    <strong className="text-base font-extrabold text-orange-400">
                      {activityStats.totalCalories} kcal
                    </strong>
                    <span className="text-[9px] text-stone-400 block">≈ 밥 {activityStats.riceBowls}공기</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg">
                    <span className="text-[10px] text-stone-400 block">예상 걸음 수</span>
                    <strong className="text-base font-extrabold text-sky-300">
                      {activityStats.estimatedSteps.toLocaleString()} 보
                    </strong>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg">
                    <span className="text-[10px] text-stone-400 block">권장 수분 섭취</span>
                    <strong className="text-base font-extrabold text-blue-300">
                      {activityStats.waterLiters} L
                    </strong>
                  </div>
                </div>

                {/* Target Matched Trails */}
                <div className="w-full md:w-auto flex flex-col items-end gap-1.5 border-t md:border-t-0 border-stone-800 pt-2 md:pt-0">
                  <span className="text-[11px] text-stone-300 font-semibold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>이 활동량에 딱 맞는 코스:</span>
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {activityStats.matchedTrails.map((tr) => (
                      <button
                        key={tr.id}
                        type="button"
                        onClick={() => onOpenDetail(tr)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-[11px] font-bold text-white transition border border-emerald-600/40"
                      >
                        {tr.name} ({tr.distanceKm}km)
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Mood Theme Tabs */}
          <div className="relative z-10 px-5 sm:px-7 pt-4 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 pb-2 min-w-max">
              {MOOD_THEMES.map((theme) => {
                const isActive = activeMoodId === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setActiveMoodId(theme.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all border ${
                      isActive
                        ? 'bg-white text-stone-900 border-white shadow-lg scale-102 ring-2 ring-emerald-400/40'
                        : 'bg-white/10 text-stone-200 border-white/15 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    <span className="text-base">{theme.emoji}</span>
                    <span>{theme.label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Hero Body: Left Spotlight Trail Card + Right Search & Quick Launchers */}
          <div className="relative z-10 p-5 sm:p-7 pt-2 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            {/* Left: Featured Spotlight Trail Showcase (7 Cols) */}
            <div className="lg:col-span-7 bg-stone-900/80 backdrop-blur-md rounded-2xl border border-white/15 p-4 sm:p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                    {currentMood.badge}
                  </span>
                  <span className="text-xs text-stone-300 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{featuredTrail.regionName} &bull; {featuredTrail.mountainOrArea}</span>
                  </span>
                </div>

                {/* Bookmark Toggle */}
                <button
                  type="button"
                  onClick={() => onToggleBookmark(featuredTrail.id)}
                  className={`p-2 rounded-xl transition ${
                    isBookmarked
                      ? 'bg-rose-500 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-stone-300'
                  }`}
                  title={isBookmarked ? '저장 목록에서 제거' : '코스 찜하기'}
                >
                  <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-white' : ''}`} />
                </button>
              </div>

              {/* Trail Title & Subtitle */}
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white hover:text-emerald-300 transition cursor-pointer" onClick={() => onOpenDetail(featuredTrail)}>
                  {featuredTrail.name}
                </h3>
                <p className="text-xs text-stone-300 mt-1 line-clamp-2 leading-relaxed">
                  {featuredTrail.subtitle}
                </p>
              </div>

              {/* Photo & Live Weather Preview */}
              <div className="relative rounded-xl overflow-hidden h-36 sm:h-44 group">
                <img
                  src={featuredTrail.coverImage}
                  alt={featuredTrail.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Weather Pill on photo */}
                <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] text-white">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>오늘 날씨: {currentMood.tempWeather.temp} ({currentMood.tempWeather.weather})</span>
                  <span className="text-stone-400">&bull;</span>
                  <span className="text-emerald-300 font-semibold">걷기 지수 {currentMood.tempWeather.airScore}</span>
                </div>

                {/* Course Tags */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {featuredTrail.tags.slice(0, 3).map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white text-[10px] font-medium"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                  <span className="text-amber-300 font-bold text-xs bg-black/60 px-2 py-0.5 rounded-md border border-amber-400/30">
                    ★ {featuredTrail.rating} ({featuredTrail.reviewCount}개 리뷰)
                  </span>
                </div>
              </div>

              {/* Key Trail Stats Bar */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-stone-400 block">코스 거리</span>
                  <strong className="text-sm font-extrabold text-white">{featuredTrail.distanceKm} km</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-stone-400 block">예상 소요시간</span>
                  <strong className="text-sm font-extrabold text-white">
                    {Math.floor(featuredTrail.durationMinutes / 60)}시간{' '}
                    {featuredTrail.durationMinutes % 60 > 0 ? `${featuredTrail.durationMinutes % 60}분` : ''}
                  </strong>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-stone-400 block">난이도</span>
                  <strong className="text-sm font-extrabold text-emerald-400">
                    {featuredTrail.difficulty === 'easy'
                      ? '초급 (쉬움)'
                      : featuredTrail.difficulty === 'moderate'
                      ? '중급 (보통)'
                      : '상급 (도전)'}
                  </strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onOpenDetail(featuredTrail)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md flex items-center justify-center gap-1.5 active:scale-98"
                >
                  <span>코스 상세 & 리뷰</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onSelectTrail(featuredTrail)}
                  className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition border border-white/20"
                >
                  지도에서 보기
                </button>
              </div>
            </div>

            {/* Right: Quick Explorer Search & Curated Launchers (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Interactive Search Field */}
              <form onSubmit={handleHeroSearchSubmit} className="space-y-2">
                <label className="text-xs font-bold text-stone-200 block">
                  원하는 산·지역·테마 바로 검색
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    placeholder="예: 지리산, 선재길, 올레길, 바다, 단풍..."
                    className="w-full pl-10 pr-20 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-stone-400 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-400 focus:bg-stone-900 transition"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
                  >
                    검색
                  </button>
                </div>
              </form>

              {/* Trending Hashtag Pills */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-stone-300 block">
                  실시간 인기 키워드:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {HOT_TAGS.map((tag, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectHotTag(tag)}
                      className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white text-[11px] font-medium border border-white/15 transition active:scale-95"
                    >
                      #{tag.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3 Quick Functional Launchers */}
              <div className="grid grid-cols-1 gap-2 pt-1">
                {/* 1. Nearby */}
                <div
                  onClick={onOpenNearby}
                  className="p-3 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-500/30 text-white transition cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-700/80 flex items-center justify-center shrink-0">
                      <Navigation className="w-4 h-4 text-emerald-200" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block text-emerald-200">내 주변 인기 코스</span>
                      <span className="text-[10px] text-stone-300">현재 위치에서 가까운 명품 둘레길 정렬</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                </div>

                {/* 2. Custom Matcher */}
                <div
                  onClick={onOpenCustomRecommend}
                  className="p-3 rounded-2xl bg-stone-900/70 hover:bg-stone-800/80 border border-white/15 text-white transition cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0 border border-amber-400/30">
                      <Sliders className="w-4 h-4 text-amber-300" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block text-amber-200">조건 맞춤 매칭 추천</span>
                      <span className="text-[10px] text-stone-300">난이도·거리·풍경(산/강/숲) 선택</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-300 group-hover:translate-x-0.5 transition-transform" />
                </div>

                {/* 3. AI Curator */}
                <div
                  onClick={onOpenAI}
                  className="p-3 rounded-2xl bg-teal-950/60 hover:bg-teal-900/70 border border-teal-500/30 text-white transition cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-600/60 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-teal-200" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block text-teal-200">AI 트래킹 큐레이터</span>
                      <span className="text-[10px] text-stone-300">동행자·체력·목적에 맞는 맞춤 추천</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-teal-300 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
