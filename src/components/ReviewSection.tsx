import React, { useState, useEffect, useMemo } from 'react';
import {
  Star,
  ThumbsUp,
  MessageSquarePlus,
  Trash2,
  CheckCircle2,
  Calendar,
  User,
  Sparkles,
  Tag,
} from 'lucide-react';
import { Review, Trail } from '../types';
import {
  getStoredReviews,
  saveUserReview,
  toggleReviewLike,
  deleteStoredReview,
} from '../data/initialReviews';

interface ReviewSectionProps {
  trail: Trail;
  onReviewsUpdated?: () => void;
}

const REVIEW_TAG_OPTIONS = [
  '#경치맛집',
  '#완만한코스',
  '#그늘풍부',
  '#등산스틱권장',
  '#대중교통편함',
  '#주차편함',
  '#화장실깨끗',
  '#부모님동반',
  '#인생사진',
  '#초보자추천',
];

const RATING_DESCRIPTIONS: Record<number, string> = {
  1: '1점 - 코스가 많이 아쉬웠어요',
  2: '2점 - 기대에 못 미쳤어요',
  3: '3점 - 무난하게 다녀올 만해요',
  4: '4점 - 만족스럽고 걷기 좋은 코스예요',
  5: '5점 - 인생 최고의 트래킹 코스! 강력 추천',
};

export const ReviewSection: React.FC<ReviewSectionProps> = ({ trail, onReviewsUpdated }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sortBy, setSortBy] = useState<'latest' | 'highest' | 'helpful'>('latest');

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [author, setAuthor] = useState('');
  const [visitDate, setVisitDate] = useState('최근 1주일 이내');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['#경치맛집', '#초보자추천']);
  const [formSuccess, setFormSuccess] = useState(false);

  // Load reviews on mount or trail change
  useEffect(() => {
    const all = getStoredReviews();
    const trailReviews = all.filter((r) => r.trailId === trail.id);
    setReviews(trailReviews);
  }, [trail.id]);

  // Calculations for rating stats
  const stats = useMemo(() => {
    if (reviews.length === 0) {
      return {
        average: trail.rating || 5.0,
        count: trail.reviewCount || 0,
        distribution: { 5: 80, 4: 15, 3: 5, 2: 0, 1: 0 },
      };
    }
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = Number((sum / reviews.length).toFixed(1));

    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
    });

    return {
      average: avg,
      count: reviews.length,
      distribution,
    };
  }, [reviews, trail]);

  // Filtered & Sorted reviews
  const sortedReviews = useMemo(() => {
    const list = [...reviews];
    if (sortBy === 'latest') {
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    if (sortBy === 'highest') {
      return list.sort((a, b) => b.rating - a.rating);
    }
    if (sortBy === 'helpful') {
      return list.sort((a, b) => b.likes - a.likes);
    }
    return list;
  }, [reviews, sortBy]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newReview: Review = {
      id: `user-rev-${Date.now()}`,
      trailId: trail.id,
      author: author.trim() || '익명의 하이커',
      rating,
      content: content.trim(),
      visitDate,
      tags: selectedTags,
      likes: 0,
      createdAt: new Date().toISOString().split('T')[0],
      isUserCreated: true,
    };

    const updated = saveUserReview(newReview);
    setReviews(updated.filter((r) => r.trailId === trail.id));
    setContent('');
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setShowForm(false);
    }, 1500);

    if (onReviewsUpdated) {
      onReviewsUpdated();
    }
  };

  const handleLike = (reviewId: string) => {
    const updated = toggleReviewLike(reviewId);
    setReviews(updated.filter((r) => r.trailId === trail.id));
  };

  const handleDelete = (reviewId: string) => {
    if (window.confirm('작성하신 리뷰를 삭제하시겠습니까?')) {
      const updated = deleteStoredReview(reviewId);
      setReviews(updated.filter((r) => r.trailId === trail.id));
    }
  };

  return (
    <div className="space-y-6 pt-2">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <span>방문자 리뷰 및 평점</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
              {stats.count}개 후기
            </span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            직접 다녀온 트래커들의 생생한 코스 후기와 팁을 확인해보세요.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm((prev) => !prev)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition shadow-xs ${
            showForm
              ? 'bg-stone-200 text-stone-800 hover:bg-stone-300'
              : 'bg-emerald-700 text-white hover:bg-emerald-800'
          }`}
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>{showForm ? '작성창 닫기' : '리뷰 작성하기'}</span>
        </button>
      </div>

      {/* Rating Overview Summary Box */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
        {/* Left: Big Rating Number */}
        <div className="sm:col-span-4 flex flex-col items-center justify-center p-2 text-center border-b sm:border-b-0 sm:border-r border-stone-200">
          <div className="text-4xl font-extrabold text-stone-900 tracking-tight">
            {stats.average}
          </div>
          <div className="flex items-center gap-1 my-1.5 text-amber-500">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(stats.average)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-stone-300'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-stone-500 font-medium">
            전체 {stats.count}명의 평가
          </span>
        </div>

        {/* Right: Star Breakdown Progress Bars */}
        <div className="sm:col-span-8 space-y-1.5 justify-center flex flex-col px-2">
          {[5, 4, 3, 2, 1].map((score) => {
            const count = stats.distribution[score] || 0;
            const percentage = stats.count > 0 ? Math.round((count / stats.count) * 100) : 0;
            return (
              <div key={score} className="flex items-center gap-2 text-xs text-stone-600">
                <span className="w-6 text-right font-medium text-stone-500">{score}점</span>
                <div className="flex-1 h-2 rounded-full bg-stone-200 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right text-[11px] text-stone-400 font-medium">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Writing Form Modal/Panel */}
      {showForm && (
        <form
          onSubmit={handleSubmitReview}
          className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>{trail.name} 생생 후기 남기기</span>
            </h4>
            <span className="text-[11px] text-emerald-800 font-medium">
              별점과 솔직한 팁을 작성해주세요
            </span>
          </div>

          {/* Interactive Star Rating Selector */}
          <div className="p-3 bg-white rounded-xl border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-stone-700 mr-2">별점 선택:</span>
              {[1, 2, 3, 4, 5].map((star) => {
                const active = star <= (hoverRating || rating);
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-stone-300 hover:scale-115 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        active ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <span className="text-xs font-bold text-amber-600">
              {RATING_DESCRIPTIONS[hoverRating || rating]}
            </span>
          </div>

          {/* Author Nickname & Visit Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                작성자 닉네임
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="예: 주말트래커, 힐링러버"
                  maxLength={15}
                  className="w-full text-xs pl-8 pr-3 py-2 rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <User className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                방문 시기
              </label>
              <div className="relative">
                <select
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="최근 1주일 이내">최근 1주일 이내</option>
                  <option value="이번 달">이번 달</option>
                  <option value="봄철 탐방">봄철 탐방 (3~5월)</option>
                  <option value="여름철 탐방">여름철 탐방 (6~8월)</option>
                  <option value="가을철 단풍">가을철 단풍 (9~11월)</option>
                  <option value="겨울 설경">겨울 설경 (12~2월)</option>
                </select>
                <Calendar className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>

          {/* Tag Chips Selection */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1">
              <Tag className="w-3 h-3 text-emerald-700" />
              <span>코스 특징 키워드 선택 (중복 가능)</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {REVIEW_TAG_OPTIONS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`text-[11px] px-2.5 py-1 rounded-full border transition ${
                      isSelected
                        ? 'bg-emerald-700 text-white border-emerald-700 font-semibold'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-emerald-300'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Review Content Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-stone-700">
                트래킹 경험 및 팁 공유 (필수)
              </label>
              <span className="text-[11px] text-stone-400">{content.length}/500자</span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="코스 난이도, 실제 경사도 체감, 그늘/식수대 유무, 주차 팁, 추천 장비 등 다른 트래커들에게 도움 될 팁을 솔직하게 작성해주세요."
              rows={3}
              maxLength={500}
              required
              className="w-full text-xs p-3 rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-200 transition"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!content.trim()}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-50 transition shadow-xs"
            >
              리뷰 등록하기
            </button>
          </div>

          {formSuccess && (
            <div className="p-3 bg-emerald-100 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>소중한 리뷰가 등록되었습니다! 평점에 즉시 반영되었습니다.</span>
            </div>
          )}
        </form>
      )}

      {/* Sort Options & Count */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs font-bold text-stone-800">
          트래커 이야기 ({sortedReviews.length})
        </span>

        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => setSortBy('latest')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              sortBy === 'latest' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            최신순
          </button>
          <button
            type="button"
            onClick={() => setSortBy('highest')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              sortBy === 'highest' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            평점 높은순
          </button>
          <button
            type="button"
            onClick={() => setSortBy('helpful')}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              sortBy === 'helpful' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            추천순
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {sortedReviews.length === 0 ? (
          <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200">
            <p className="text-xs text-stone-500">아직 등록된 후기가 없습니다.</p>
            <p className="text-xs text-stone-700 font-semibold mt-1">
              이 코스의 첫 번째 리뷰어가 되어보세요!
            </p>
          </div>
        ) : (
          sortedReviews.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs space-y-2.5 transition hover:border-stone-300"
            >
              {/* Header: Rating & Author & Date */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= item.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-stone-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-stone-900">{item.author}</span>
                  {item.isUserCreated && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 font-medium">
                      내 리뷰
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-stone-400">
                  <span>{item.visitDate}</span>
                  <span>&bull;</span>
                  <span>{item.createdAt}</span>
                </div>
              </div>

              {/* Tag Badges */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Review Text */}
              <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-line">
                {item.content}
              </p>

              {/* Bottom Actions: Helpful like & Delete (if user created) */}
              <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => handleLike(item.id)}
                  className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-emerald-700 transition"
                  title="이 후기가 도움이 되었나요?"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>도움이 돼요</span>
                  <span className="font-semibold text-emerald-700">({item.likes})</span>
                </button>

                {item.isUserCreated && (
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center gap-1 text-[11px] text-stone-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>삭제</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
