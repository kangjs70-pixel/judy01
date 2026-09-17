import React from 'react';
import { Search, SlidersHorizontal, X, Mountain, Map, List, Layers } from 'lucide-react';
import { FilterState, Region, TrailDifficulty } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalCount: number;
  filteredCount: number;
  viewMode: 'split' | 'list' | 'map';
  onChangeViewMode: (mode: 'split' | 'list' | 'map') => void;
  hasUserLocation: boolean;
}

const REGION_OPTIONS: { id: Region; label: string }[] = [
  { id: 'all', label: '전국' },
  { id: 'seoul', label: '서울' },
  { id: 'gyeonggi', label: '경기' },
  { id: 'gangwon', label: '강원' },
  { id: 'chungcheong', label: '충청' },
  { id: 'jeolla', label: '전라' },
  { id: 'gyeongsang', label: '경상' },
  { id: 'jeju', label: '제주' },
];

const DIFFICULTY_OPTIONS: { id: 'all' | TrailDifficulty; label: string; color: string }[] = [
  { id: 'all', label: '난이도 전체', color: 'bg-stone-100 text-stone-700' },
  { id: 'easy', label: '쉬움 (초급)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'moderate', label: '보통 (중급)', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'hard', label: '도전 (상급)', color: 'bg-rose-50 text-rose-700 border-rose-200' },
];

const THEME_TAGS = [
  '전체',
  '숲길',
  '계곡',
  '해안길',
  '억새',
  '성곽길',
  '완만한길',
  '가족동반',
  '일몰/야경',
  '피톤치드',
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalCount,
  filteredCount,
  viewMode,
  onChangeViewMode,
  hasUserLocation,
}) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.region !== 'all' ||
    filters.difficulty !== 'all' ||
    filters.theme !== '전체' ||
    filters.facilities.publicTransitOnly ||
    filters.facilities.parkingOnly ||
    filters.facilities.petFriendlyOnly;

  return (
    <div className="bg-white border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-3">
        {/* Top row: Search input + View Mode Switch + Filter Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              id="search-input"
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              placeholder="코스 이름, 산 이름, 지역(예: 설악산, 오대산, 제주, 계곡) 검색..."
              className="w-full pl-10 pr-10 py-2.5 bg-stone-50 hover:bg-stone-100/70 focus:bg-white border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition"
            />
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() => onFilterChange({ searchQuery: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right controls: View mode toggles + Filter expansion button */}
          <div className="flex items-center justify-between sm:justify-end gap-2">
            {/* View Mode Buttons (Split / List / Map) */}
            <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
              <button
                type="button"
                onClick={() => onChangeViewMode('split')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  viewMode === 'split'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="지도와 목록 함께 보기"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden md:inline">분할뷰</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeViewMode('list')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  viewMode === 'list'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="목록 중심 보기"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden md:inline">목록뷰</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeViewMode('map')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  viewMode === 'map'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="지도 전체 화면"
              >
                <Map className="w-3.5 h-3.5" />
                <span className="hidden md:inline">지도뷰</span>
              </button>
            </div>

            {/* Advanced Filters Button */}
            <button
              id="btn-advanced-filters"
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition ${
                showAdvanced || hasActiveFilters
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>상세필터</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              )}
            </button>
          </div>
        </div>

        {/* Region selector row */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-stone-400 font-medium whitespace-nowrap mr-1">지역:</span>
          {REGION_OPTIONS.map((region) => {
            const isSelected = filters.region === region.id;
            return (
              <button
                key={region.id}
                type="button"
                onClick={() => onFilterChange({ region: region.id })}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900'
                }`}
              >
                {region.label}
              </button>
            );
          })}
        </div>

        {/* Theme tags scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-stone-400 font-medium whitespace-nowrap mr-1">테마:</span>
          {THEME_TAGS.map((theme) => {
            const isSelected = filters.theme === theme;
            return (
              <button
                key={theme}
                type="button"
                onClick={() => onFilterChange({ theme })}
                className={`px-2.5 py-1 rounded-md border text-xs font-medium whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                    : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                #{theme}
              </button>
            );
          })}
        </div>

        {/* Collapsible Advanced Filters section */}
        {showAdvanced && (
          <div className="pt-3 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* Difficulty select */}
            <div>
              <label className="block text-stone-600 font-medium mb-1.5">난이도</label>
              <div className="flex flex-wrap gap-1.5">
                {DIFFICULTY_OPTIONS.map((diff) => {
                  const isSelected = filters.difficulty === diff.id;
                  return (
                    <button
                      key={diff.id}
                      type="button"
                      onClick={() => onFilterChange({ difficulty: diff.id })}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition ${
                        isSelected
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {diff.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sort by */}
            <div>
              <label className="block text-stone-600 font-medium mb-1.5">정렬 방식</label>
              <select
                value={filters.sortBy}
                onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
                className="w-full bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="popular">추천 인기순</option>
                <option value="rating">평점 높은순</option>
                <option value="distance_asc">코스 거리 짧은순</option>
                <option value="duration_asc">소요 시간 짧은순</option>
                {hasUserLocation && <option value="near_me">내 위치에서 가까운순</option>}
              </select>
            </div>

            {/* Facilities / Conditions */}
            <div>
              <label className="block text-stone-600 font-medium mb-1.5">편의 및 조건</label>
              <div className="flex flex-wrap gap-2">
                <label className="inline-flex items-center gap-1.5 text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.facilities.publicTransitOnly}
                    onChange={(e) =>
                      onFilterChange({
                        facilities: { ...filters.facilities, publicTransitOnly: e.target.checked },
                      })
                    }
                    className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>대중교통 접근 용이</span>
                </label>
                <label className="inline-flex items-center gap-1.5 text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.facilities.parkingOnly}
                    onChange={(e) =>
                      onFilterChange({
                        facilities: { ...filters.facilities, parkingOnly: e.target.checked },
                      })
                    }
                    className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>주차 가능</span>
                </label>
                <label className="inline-flex items-center gap-1.5 text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.facilities.petFriendlyOnly}
                    onChange={(e) =>
                      onFilterChange({
                        facilities: { ...filters.facilities, petFriendlyOnly: e.target.checked },
                      })
                    }
                    className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>반려견 동반 가능</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Results summary & Reset filters */}
        <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
          <div>
            총 <span className="font-semibold text-stone-900">{filteredCount}</span>개 코스
            {filteredCount !== totalCount && (
              <span> (전체 {totalCount}개 중 검색됨)</span>
            )}
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-stone-500 hover:text-rose-600 flex items-center gap-1 underline transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              필터 초기화
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
