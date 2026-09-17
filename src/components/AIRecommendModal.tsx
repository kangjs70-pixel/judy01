import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Send,
  Loader2,
  Compass,
  CheckCircle,
  Lightbulb,
  ArrowRight,
  Mountain,
  Users,
} from 'lucide-react';
import { AIRecommendationResponse, Trail } from '../types';

interface AIRecommendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTrailByName: (name: string) => void;
  allTrails: Trail[];
}

const PRESET_QUERIES = [
  '주말에 부모님 모시고 걷기 좋은 평탄한 숲길 추천해줘',
  '수도권에서 대중교통으로 갈 수 있는 2~3시간 계곡/성곽 코스',
  '바다 보며 힐링할 수 있는 탁 트인 해안 둘레길',
  '초보 혼자 가기 좋은 안전하고 풍경 멋진 가을 트래킹',
];

export const AIRecommendModal: React.FC<AIRecommendModalProps> = ({
  isOpen,
  onClose,
  onSelectTrailByName,
  allTrails,
}) => {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('전국');
  const [difficulty, setDifficulty] = useState('무관');
  const [theme, setTheme] = useState('자연/힐링');
  const [companion, setCompanion] = useState('누구나');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIRecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const promptToSend = customQuery || query;
    if (!promptToSend.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuery: promptToSend,
          preferences: { region, difficulty, theme, companion },
        }),
      });

      const data = await response.json();
      if (data.recommendation) {
        setResult(data.recommendation);
      } else {
        setError(data.error || '추천 결과를 가져오지 못했습니다.');
      }
    } catch (err: any) {
      setError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPreset = (preset: string) => {
    setQuery(preset);
    handleSubmit(undefined, preset);
  };

  const findMatchingLocalTrail = (trailName: string): Trail | undefined => {
    const cleanName = trailName.replace(/\(.*?\)/g, '').trim().toLowerCase();
    return allTrails.find(
      (t) =>
        t.name.toLowerCase().includes(cleanName) ||
        cleanName.includes(t.name.toLowerCase()) ||
        t.mountainOrArea.toLowerCase().includes(cleanName)
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div
        id="ai-recommend-modal"
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col border border-stone-200"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Sparkles className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">AI 트래킹 큐레이터</h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                  Gemini Flash
                </span>
              </div>
              <p className="text-xs text-emerald-100/80 mt-0.5">
                원하는 상황, 동행인, 분위기를 알려주시면 최적의 코스를 진단해드립니다
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

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-stone-800 text-xs">
          {/* Query Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={2}
                placeholder="어떤 트래킹을 원하시나요? (예: 무릎에 무리 없는 완만한 숲길, 대중교통으로 가기 편한 곳, 바다 둘레길 등)"
                className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 text-xs sm:text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 resize-none transition"
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="absolute right-2.5 bottom-3 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-semibold flex items-center gap-1.5 transition text-xs shadow-xs"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>추천 분석 중...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>추천받기</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Presets */}
            <div>
              <span className="text-[11px] font-medium text-stone-400 mb-1.5 block">
                자주 찾는 추천 키워드:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_QUERIES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-600 text-[11px] font-medium transition text-left"
                  >
                    "{preset}"
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Preferences Filters */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div>
                <label className="text-stone-500 block mb-1">희망 지역</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-1.5"
                >
                  <option value="전국">전국 어디든</option>
                  <option value="수도권(서울/경기)">서울/경기권</option>
                  <option value="강원">강원권</option>
                  <option value="충청">충청권</option>
                  <option value="전라">전라권</option>
                  <option value="경상">경상권</option>
                  <option value="제주">제주도</option>
                </select>
              </div>
              <div>
                <label className="text-stone-500 block mb-1">난이도</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-1.5"
                >
                  <option value="무관">난이도 무관</option>
                  <option value="쉬움(초보/완만)">쉬움 (초급/완만)</option>
                  <option value="보통(적당한 운동)">보통 (중급/적당)</option>
                  <option value="도전(상급자)">도전 (상급/등산)</option>
                </select>
              </div>
              <div>
                <label className="text-stone-500 block mb-1">테마</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-1.5"
                >
                  <option value="자연/힐링">자연/숲길 힐링</option>
                  <option value="계곡/폭포">시원한 계곡/폭포</option>
                  <option value="바다/해안">탁 트인 바다/해안</option>
                  <option value="능선/억새">시원한 능선/억새</option>
                  <option value="역사/성곽">성곽/문화유적</option>
                </select>
              </div>
              <div>
                <label className="text-stone-500 block mb-1">동행</label>
                <select
                  value={companion}
                  onChange={(e) => setCompanion(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-1.5"
                >
                  <option value="누구나">혼자 또는 누구나</option>
                  <option value="부모님">부모님과 함께</option>
                  <option value="아이/가족">아이/온 가족</option>
                  <option value="친구/연인">친구/연인과 함께</option>
                </select>
              </div>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs">
              {error}
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-700 mx-auto" />
              <p className="text-sm font-semibold text-stone-800">
                AI가 전국 트래킹 데이터베이스를 분석하고 있습니다...
              </p>
              <p className="text-xs text-stone-500">
                경사도, 코스 길이, 계절 경관, 편의시설 조건을 맞춤 진단 중입니다.
              </p>
            </div>
          )}

          {/* Recommendation Results */}
          {result && !loading && (
            <div className="space-y-4 pt-2 border-t border-stone-200 animate-fade-in">
              {/* Title & Summary */}
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80">
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  AI 맞춤 진단 결과
                </span>
                <h4 className="text-base font-bold text-emerald-950 mt-1.5">{result.title}</h4>
                <p className="text-xs sm:text-sm text-stone-700 mt-1 leading-relaxed">
                  {result.summary}
                </p>
              </div>

              {/* Recommended Trails List */}
              <div className="space-y-3">
                <h5 className="font-bold text-stone-900 text-xs uppercase tracking-wider text-stone-500">
                  추천 코스 목록
                </h5>
                {result.recommendedTrails.map((trailRec, idx) => {
                  const localMatch = findMatchingLocalTrail(trailRec.name);
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-emerald-300 transition space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                              {idx + 1}
                            </span>
                            <h6 className="font-bold text-stone-900 text-sm">{trailRec.name}</h6>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500">
                            <span>난이도: {trailRec.difficulty}</span>
                            <span>&bull;</span>
                            <span>거리: {trailRec.distance}</span>
                            <span>&bull;</span>
                            <span>소요시간: {trailRec.duration}</span>
                          </div>
                        </div>

                        {localMatch && (
                          <button
                            type="button"
                            onClick={() => {
                              onSelectTrailByName(localMatch.name);
                              onClose();
                            }}
                            className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition"
                          >
                            <span>지도에서 보기</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl space-y-1">
                        <div>
                          <span className="font-semibold text-stone-800">풍경 포인트: </span>
                          <span>{trailRec.highlights}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-stone-800">추천 이유: </span>
                          <span>{trailRec.whyRecommended}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Expert Tips */}
              {result.tips && result.tips.length > 0 && (
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <h5 className="font-bold text-stone-900 flex items-center gap-1.5 mb-2">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>큐레이터 핵심 조언 & 준비 팁</span>
                  </h5>
                  <ul className="list-disc list-inside space-y-1 text-xs text-stone-600">
                    {result.tips.map((tip, idx) => (
                      <li key={idx} className="leading-relaxed">{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
