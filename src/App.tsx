import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { TrailCard } from './components/TrailCard';
import { TrailMap } from './components/TrailMap';
import { TrailDetailModal } from './components/TrailDetailModal';
import { AIRecommendModal } from './components/AIRecommendModal';
import { SafetyGuideModal } from './components/SafetyGuideModal';
import { NearbyTrailsModal } from './components/NearbyTrailsModal';
import { CustomRecommendModal } from './components/CustomRecommendModal';
import { InteractiveHero } from './components/InteractiveHero';
import { FeaturedVideoSection } from './components/FeaturedVideoSection';
import { TRAILS_DATA } from './data/trails';
import { Trail, FilterState, TrailDifficulty } from './types';
import { Compass, Sparkles, ShieldAlert, Heart, MapPin, AlertCircle, Navigation, Sliders, ArrowRight } from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  region: 'all',
  difficulty: 'all',
  theme: '전체',
  maxDurationMinutes: 600,
  maxDistanceKm: 50,
  sortBy: 'popular',
  facilities: {
    publicTransitOnly: false,
    parkingOnly: false,
    petFriendlyOnly: false,
  },
};

// Calculate Haversine distance in kilometers
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

export default function App() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [selectedTrail, setSelectedTrail] = useState<Trail | null>(TRAILS_DATA[0]);
  const [detailModalTrail, setDetailModalTrail] = useState<Trail | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [isNearbyOpen, setIsNearbyOpen] = useState(false);
  const [isCustomRecommendOpen, setIsCustomRecommendOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'list' | 'map'>('split');
  const [activeTab, setActiveTab] = useState<'all' | 'bookmarks'>('all');

  // Local storage for bookmarked trails
  const [bookmarkedTrailIds, setBookmarkedTrailIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('trailfinder_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Geolocation
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);

  const handleSetCustomLocation = (lat: number, lng: number, name: string) => {
    setUserLocation({ lat, lng });
    setLocationName(name);
    setFilters((prev) => ({ ...prev, sortBy: 'near_me' }));
    setLocationNotice(`기준 위치가 '${name}'(으)로 설정되었습니다. 가까운 코스 순으로 정렬됩니다.`);
    setTimeout(() => setLocationNotice(null), 4000);
  };

  // Sync bookmarks with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('trailfinder_bookmarks', JSON.stringify(bookmarkedTrailIds));
    } catch (e) {
      console.error('Failed to save bookmarks:', e);
    }
  }, [bookmarkedTrailIds]);

  const handleToggleBookmark = (trailId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedTrailIds((prev) =>
      prev.includes(trailId) ? prev.filter((id) => id !== trailId) : [...prev, trailId]
    );
  };

  const handleGetNearMe = () => {
    if (!navigator.geolocation) {
      setLocationNotice('사용 중인 브라우저에서 위치 서비스를 지원하지 않습니다.');
      return;
    }

    setIsLocating(true);
    setLocationNotice(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setFilters((prev) => ({ ...prev, sortBy: 'near_me' }));
        setIsLocating(false);
        setLocationNotice('현재 위치를 확인했습니다! 가까운 코스 순서대로 정렬되었습니다.');
        setTimeout(() => setLocationNotice(null), 4000);
      },
      (error) => {
        setIsLocating(false);
        let msg = '위치 권한을 허용해주시면 내 주변 코스를 추천해드립니다.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = '브라우저 위치 정보 제공이 차단되어 있습니다. 권한을 확인해주세요.';
        }
        setLocationNotice(msg);
        setTimeout(() => setLocationNotice(null), 5000);
      },
      { timeout: 10000 }
    );
  };

  const handleSelectTrail = (trail: Trail) => {
    setSelectedTrail(trail);
  };

  const handleOpenDetail = (trail: Trail) => {
    setDetailModalTrail(trail);
    setIsDetailOpen(true);
  };

  const handleSelectTrailByName = (name: string) => {
    const matched = TRAILS_DATA.find(
      (t) => t.name.includes(name) || name.includes(t.name)
    );
    if (matched) {
      setSelectedTrail(matched);
      setDetailModalTrail(matched);
      setIsDetailOpen(true);
    }
  };

  // Filter and Sort trails
  const filteredTrails = useMemo(() => {
    return TRAILS_DATA.filter((trail) => {
      // Bookmark tab check
      if (activeTab === 'bookmarks' && !bookmarkedTrailIds.includes(trail.id)) {
        return false;
      }

      // Keyword query search
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchesName = trail.name.toLowerCase().includes(query);
        const matchesSubtitle = trail.subtitle.toLowerCase().includes(query);
        const matchesMountain = trail.mountainOrArea.toLowerCase().includes(query);
        const matchesRegion = trail.regionName.toLowerCase().includes(query);
        const matchesTag = trail.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesSubtitle && !matchesMountain && !matchesRegion && !matchesTag) {
          return false;
        }
      }

      // Region check with strict and inclusive administrative division matching
      if (filters.region !== 'all') {
        const matchesPrimary = trail.region === filters.region;
        const matchesMulti = trail.regions && trail.regions.includes(filters.region);
        const matchesText = (
          (filters.region === 'seoul' && (trail.regionName.includes('서울') || trail.region === 'seoul')) ||
          (filters.region === 'gyeonggi' && (trail.regionName.includes('경기') || trail.region === 'gyeonggi')) ||
          (filters.region === 'gangwon' && (trail.regionName.includes('강원') || trail.region === 'gangwon')) ||
          (filters.region === 'chungcheong' && (trail.regionName.includes('충청') || trail.regionName.includes('충북') || trail.regionName.includes('충남') || trail.region === 'chungcheong')) ||
          (filters.region === 'jeolla' && (trail.regionName.includes('전라') || trail.regionName.includes('전북') || trail.regionName.includes('전남') || trail.region === 'jeolla')) ||
          (filters.region === 'gyeongsang' && (trail.regionName.includes('경상') || trail.regionName.includes('경북') || trail.regionName.includes('경남') || trail.regionName.includes('부산') || trail.regionName.includes('울산') || trail.region === 'gyeongsang')) ||
          (filters.region === 'jeju' && (trail.regionName.includes('제주') || trail.region === 'jeju'))
        );
        if (!matchesPrimary && !matchesMulti && !matchesText) {
          return false;
        }
      }

      // Difficulty check
      if (filters.difficulty !== 'all' && trail.difficulty !== filters.difficulty) {
        return false;
      }

      // Theme tag check
      if (filters.theme !== '전체') {
        const matchesTheme =
          trail.tags.includes(filters.theme) ||
          trail.subtitle.includes(filters.theme) ||
          trail.description.includes(filters.theme);
        if (!matchesTheme) return false;
      }

      // Facilities filters
      if (filters.facilities.publicTransitOnly && !trail.facilities.publicTransit) {
        return false;
      }
      if (filters.facilities.parkingOnly && !trail.facilities.parking) {
        return false;
      }
      if (filters.facilities.petFriendlyOnly && !trail.facilities.petFriendly) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'near_me' && userLocation) {
        const distA = getDistanceFromLatLng(
          userLocation.lat,
          userLocation.lng,
          a.startPoint.lat,
          a.startPoint.lng
        );
        const distB = getDistanceFromLatLng(
          userLocation.lat,
          userLocation.lng,
          b.startPoint.lat,
          b.startPoint.lng
        );
        return distA - distB;
      }

      if (filters.sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (filters.sortBy === 'distance_asc') {
        return a.distanceKm - b.distanceKm;
      }
      if (filters.sortBy === 'duration_asc') {
        return a.durationMinutes - b.durationMinutes;
      }

      // Default 'popular'
      return b.rating * b.reviewCount - a.rating * a.reviewCount;
    });
  }, [filters, activeTab, bookmarkedTrailIds, userLocation]);

  const featuredVideoTrail = useMemo(() => {
    return (
      TRAILS_DATA.find((t) => t.youtubeVideoId === 'gQ23SkbKSmc') ||
      TRAILS_DATA.find((t) => !!t.youtubeVideoId)
    );
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans">
      {/* Top Header */}
      <Header
        onOpenAI={() => setIsAIOpen(true)}
        onOpenNearby={() => setIsNearbyOpen(true)}
        onOpenCustomRecommend={() => setIsCustomRecommendOpen(true)}
        bookmarkCount={bookmarkedTrailIds.length}
        onOpenBookmarks={() =>
          setActiveTab((prev) => (prev === 'bookmarks' ? 'all' : 'bookmarks'))
        }
        onGetNearMe={handleGetNearMe}
        isLocating={isLocating}
        activeTab={activeTab}
      />

      {/* Interactive Hero Section with Mood Themes, Roulette, Activity Calculator & Quick Search */}
      <InteractiveHero
        allTrails={TRAILS_DATA}
        onSelectTrail={(trail) => {
          setSelectedTrail(trail);
        }}
        onOpenDetail={(trail) => {
          setDetailModalTrail(trail);
          setIsDetailOpen(true);
        }}
        onToggleBookmark={handleToggleBookmark}
        bookmarkedTrailIds={bookmarkedTrailIds}
        onOpenNearby={() => setIsNearbyOpen(true)}
        onOpenCustomRecommend={() => setIsCustomRecommendOpen(true)}
        onOpenAI={() => setIsAIOpen(true)}
        onApplySearchQuery={(query) => setFilters((prev) => ({ ...prev, searchQuery: query }))}
        onApplyFilterCriteria={({ difficulty, theme, searchQuery }) => {
          setFilters((prev) => ({
            ...prev,
            ...(difficulty !== undefined ? { difficulty } : {}),
            ...(theme !== undefined ? { theme } : {}),
            ...(searchQuery !== undefined ? { searchQuery } : {}),
          }));
        }}
      />

      {/* Filter and Search Controls */}
      <FilterBar
        filters={filters}
        onFilterChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
        onResetFilters={() => setFilters(INITIAL_FILTERS)}
        totalCount={TRAILS_DATA.length}
        filteredCount={filteredTrails.length}
        viewMode={viewMode}
        onChangeViewMode={(mode) => setViewMode(mode)}
        hasUserLocation={!!userLocation}
      />

      {/* Location Toast Notification */}
      {locationNotice && (
        <div className="bg-emerald-800 text-white px-4 py-2.5 text-xs text-center font-medium shadow-md flex items-center justify-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{locationNotice}</span>
        </div>
      )}

      {/* Bookmarks Filter Alert Bar */}
      {activeTab === 'bookmarks' && (
        <div className="bg-rose-50 border-b border-rose-200 px-4 py-2.5 flex items-center justify-between text-xs text-rose-800 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            <span className="font-semibold">
              저장한 나만의 트래킹 코스 ({filteredTrails.length}개)
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className="text-xs underline font-semibold hover:text-rose-950"
          >
            전체 코스 보기로 돌아가기
          </button>
        </div>
      )}

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Featured Trekking Video Guide (YouTube Embed) */}
        {featuredVideoTrail && (
          <FeaturedVideoSection
            trail={featuredVideoTrail}
            onOpenDetail={handleOpenDetail}
            onSelectTrail={handleSelectTrail}
          />
        )}

        {/* VIEW MODE 1: Split View (Map + Cards) */}
        {viewMode === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left/Top: Cards List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <span>추천 트래킹 코스</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
                    {filteredTrails.length}
                  </span>
                </h2>
                <button
                  type="button"
                  onClick={() => setIsSafetyOpen(true)}
                  className="text-xs font-semibold text-stone-600 hover:text-emerald-800 flex items-center gap-1 transition"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-stone-500" />
                  <span>안전 수칙 & LNT</span>
                </button>
              </div>

              {filteredTrails.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-stone-800">
                    조건에 맞는 코스가 없습니다
                  </h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    검색어나 선택된 필터를 초기화하거나 다른 지역을 탐색해보세요.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFilters(INITIAL_FILTERS);
                      setActiveTab('all');
                    }}
                    className="px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-xl hover:bg-emerald-800 transition"
                  >
                    필터 전체 초기화
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredTrails.map((trail) => {
                    const distFromUser = userLocation
                      ? getDistanceFromLatLng(
                          userLocation.lat,
                          userLocation.lng,
                          trail.startPoint.lat,
                          trail.startPoint.lng
                        )
                      : null;

                    return (
                      <TrailCard
                        key={trail.id}
                        trail={trail}
                        isSelected={selectedTrail?.id === trail.id}
                        isBookmarked={bookmarkedTrailIds.includes(trail.id)}
                        onSelect={handleSelectTrail}
                        onToggleBookmark={handleToggleBookmark}
                        onOpenDetail={handleOpenDetail}
                        distanceFromUser={distFromUser}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Sticky Interactive Map */}
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl p-2 border border-stone-200 shadow-xs">
                <div className="h-[480px] lg:h-[620px] rounded-xl overflow-hidden">
                  <TrailMap
                    trails={filteredTrails}
                    selectedTrail={selectedTrail}
                    onSelectTrail={handleSelectTrail}
                    userLocation={userLocation}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW MODE 2: List Only View */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <span>트래킹 코스 전체 목록</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
                  {filteredTrails.length}
                </span>
              </h2>
              <button
                type="button"
                onClick={() => setIsSafetyOpen(true)}
                className="text-xs font-semibold text-stone-600 hover:text-emerald-800 flex items-center gap-1 transition"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-stone-500" />
                <span>안전 수칙 & LNT</span>
              </button>
            </div>

            {filteredTrails.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
                <Compass className="w-8 h-8 text-stone-400 mx-auto" />
                <h3 className="text-base font-bold text-stone-800">일치하는 코스가 없습니다</h3>
                <button
                  type="button"
                  onClick={() => setFilters(INITIAL_FILTERS)}
                  className="px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-xl hover:bg-emerald-800 transition"
                >
                  필터 초기화
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTrails.map((trail) => {
                  const distFromUser = userLocation
                    ? getDistanceFromLatLng(
                        userLocation.lat,
                        userLocation.lng,
                        trail.startPoint.lat,
                        trail.startPoint.lng
                      )
                    : null;

                  return (
                    <TrailCard
                      key={trail.id}
                      trail={trail}
                      isSelected={selectedTrail?.id === trail.id}
                      isBookmarked={bookmarkedTrailIds.includes(trail.id)}
                      onSelect={handleSelectTrail}
                      onToggleBookmark={handleToggleBookmark}
                      onOpenDetail={handleOpenDetail}
                      distanceFromUser={distFromUser}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW MODE 3: Map Centric View */}
        {viewMode === 'map' && (
          <div className="h-[calc(100vh-220px)] min-h-[500px] rounded-2xl overflow-hidden border border-stone-200 shadow-sm">
            <TrailMap
              trails={filteredTrails}
              selectedTrail={selectedTrail}
              onSelectTrail={handleSelectTrail}
              userLocation={userLocation}
              className="h-full"
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 mt-12 py-8 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-700" />
            <span className="font-bold text-stone-800">트레일파인더 (TrailFinder)</span>
            <span>&bull; 전국 트래킹 코스 & 둘레길 탐색기</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsSafetyOpen(true)}
              className="hover:text-stone-900 transition"
            >
              산행 안전수칙 & LNT
            </button>
            <button
              type="button"
              onClick={() => setIsAIOpen(true)}
              className="hover:text-stone-900 transition flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI 맞춤 코스 진단</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Trail Detail Modal */}
      <TrailDetailModal
        trail={detailModalTrail}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        isBookmarked={!!detailModalTrail && bookmarkedTrailIds.includes(detailModalTrail.id)}
        onToggleBookmark={handleToggleBookmark}
      />

      {/* AI Recommendation Modal */}
      <AIRecommendModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        onSelectTrailByName={handleSelectTrailByName}
        allTrails={TRAILS_DATA}
      />

      {/* Safety Guide Modal */}
      <SafetyGuideModal isOpen={isSafetyOpen} onClose={() => setIsSafetyOpen(false)} />

      {/* Nearby Trails Recommendation Modal */}
      <NearbyTrailsModal
        isOpen={isNearbyOpen}
        onClose={() => setIsNearbyOpen(false)}
        trails={TRAILS_DATA}
        userLocation={userLocation}
        onGetNearMe={handleGetNearMe}
        isLocating={isLocating}
        onSelectTrail={(trail) => {
          setSelectedTrail(trail);
          setIsNearbyOpen(false);
        }}
        onOpenDetail={(trail) => {
          setDetailModalTrail(trail);
          setIsDetailOpen(true);
        }}
        onSetCustomLocation={handleSetCustomLocation}
      />

      {/* Custom Preference Recommendation Modal */}
      <CustomRecommendModal
        isOpen={isCustomRecommendOpen}
        onClose={() => setIsCustomRecommendOpen(false)}
        allTrails={TRAILS_DATA}
        onSelectTrail={(trail) => {
          setSelectedTrail(trail);
          setIsCustomRecommendOpen(false);
        }}
        onOpenDetail={(trail) => {
          setDetailModalTrail(trail);
          setIsDetailOpen(true);
        }}
        onApplyFilters={({ difficulty, theme, maxDistanceKm, region }) => {
          setFilters((prev) => ({
            ...prev,
            difficulty,
            theme,
            maxDistanceKm,
            region: region ? region : prev.region,
          }));
        }}
      />
    </div>
  );
}
