import { Review } from '../types';

export const INITIAL_REVIEWS: Review[] = [
  // 오대산 선재길
  {
    id: 'rev-odaesan-1',
    trailId: 'odaesan-seonjaegil',
    author: '피톤치드홀릭',
    rating: 5,
    visitDate: '2024년 5월',
    content: '부모님 모시고 다녀왔는데 경사가 정말 완만해서 3시간 동안 무릎 아프다는 말씀 한번도 안 하셨습니다. 섶다리 건널 때 물소리와 전나무 향이 환상적이에요. 편도로 걷고 상원사에서 버스타고 내려오시는 코스 강력 추천합니다!',
    tags: ['#부모님동반', '#완만한길', '#피톤치드', '#물소리힐링'],
    likes: 24,
    createdAt: '2024-05-18',
  },
  {
    id: 'rev-odaesan-2',
    trailId: 'odaesan-seonjaegil',
    author: '산들바람',
    rating: 5,
    visitDate: '2024년 10월',
    content: '가을 단풍철에 다녀왔습니다. 월정사 일주문 앞 전나무숲길 맨발 걷기는 필수 코스예요. 계곡 물이 너무 맑고 중간중간 쉼터 데크가 잘 갖춰져 있어서 도시락 먹기 딱 좋습니다.',
    tags: ['#가을단풍', '#맨발걷기', '#쉼터완비'],
    likes: 18,
    createdAt: '2024-10-22',
  },
  {
    id: 'rev-odaesan-3',
    trailId: 'odaesan-seonjaegil',
    author: '주말워커',
    rating: 4,
    visitDate: '2024년 7월',
    content: '여름에도 울창한 나무 그늘 덕분에 덥지 않아요. 단, 주말에는 상원사 주차장이 일찍 만차가 되니 월정사 쪽에 주차하고 버스로 이동하는 편이 훨씬 수월합니다.',
    tags: ['#그늘풍부', '#주차팁'],
    likes: 9,
    createdAt: '2024-07-14',
  },

  // 북한산 우이령길
  {
    id: 'rev-uiryeong-1',
    trailId: 'bukhansan-uiryeong',
    author: '도봉산러버',
    rating: 5,
    visitDate: '2024년 4월',
    content: '국립공원 예약제라 사람이 붐비지 않고 정말 호젓합니다. 오봉 전망대에서 바라보는 다섯 봉우리의 위용은 감탄이 절로 나옵니다. 길이 넓고 흙길이라 트래킹화만 신어도 충분해요.',
    tags: ['#오봉전망', '#예약제한적함', '#초보추천'],
    likes: 31,
    createdAt: '2024-04-20',
  },
  {
    id: 'rev-uiryeong-2',
    trailId: 'bukhansan-uiryeong',
    author: '서울산책자',
    rating: 4,
    visitDate: '2024년 9월',
    content: '우이동 쪽에서 출발해서 교현리로 넘어갔습니다. 대전차 장애물 지나며 역사적 의미도 되새길 수 있었네요. 그늘이 적은 구간이 일부 있으니 자외선 차단 모자는 필수입니다.',
    tags: ['#대중교통편함', '#모자필수', '#역사트래킹'],
    likes: 12,
    createdAt: '2024-09-08',
  },

  // 영남알프스 간월재
  {
    id: 'rev-ganwoljae-1',
    trailId: 'yeongnam-alps-ganwoljae',
    author: '은빛바람',
    rating: 5,
    visitDate: '2024년 10월',
    content: '사슴농장 코스로 올라가니 완만한 임도라 힘들이지 않고 10만 평 억새평원에 닿을 수 있었습니다. 간월재 휴게소에서 억새 바다를 바라보며 먹는 컵라면은 인생 최고의 맛입니다!',
    tags: ['#억새명소', '#인생사진', '#간월재라면'],
    likes: 45,
    createdAt: '2024-10-15',
  },
  {
    id: 'rev-ganwoljae-2',
    trailId: 'yeongnam-alps-ganwoljae',
    author: '트랙스타',
    rating: 4,
    visitDate: '2024년 11월',
    content: '바람이 꽤 세게 부는 편이라 방풍 자켓 챙기길 잘했습니다. 왕복 11km라 거리가 좀 있으니 가벼운 간식과 물 2병은 꼭 챙기세요.',
    tags: ['#바람막이필수', '#물충분히', '#전망최고'],
    likes: 19,
    createdAt: '2024-11-03',
  },

  // 제주 올레길 7코스
  {
    id: 'rev-olle7-1',
    trailId: 'jeju-olle-7',
    author: '제주바당',
    rating: 5,
    visitDate: '2024년 6월',
    content: '올레길 전 코스 중 바다 풍경은 역시 7코스가 으뜸입니다. 외돌개와 돔베낭길 사이 절벽을 따라 걷는 내내 감탄했습니다. 범섬을 배경으로 사진 찍으면 정말 예쁘게 나와요.',
    tags: ['#바다전망', '#제주올레', '#포토존'],
    likes: 38,
    createdAt: '2024-06-12',
  },
  {
    id: 'rev-olle7-2',
    trailId: 'jeju-olle-7',
    author: '올레완주도전',
    rating: 5,
    visitDate: '2024년 9월',
    content: '일강정 바당길 구간의 몽돌 밟는 소리가 힐링됩니다. 바닷바람이 시원하고 중간에 예쁜 로컬 카페들이 있어서 쉬어가기 좋았습니다.',
    tags: ['#해안산책', '#카페연계', '#힐링코스'],
    likes: 15,
    createdAt: '2024-09-25',
  },

  // 인왕산 한양도성
  {
    id: 'rev-inwang-1',
    trailId: 'inwangsan-hanyangdoseong',
    author: '도시하이커',
    rating: 5,
    visitDate: '2024년 8월',
    content: '경복궁역에서 시작해서 범바위 거쳐 정산까지 1시간 남짓이면 올라갑니다. 해질녘에 오르면 서울 도심의 노을과 남산타워 야경이 동시에 펼쳐져요. 퇴근 후 야간 산행으로도 강추합니다.',
    tags: ['#야경명소', '#퇴근후산행', '#대중교통최고'],
    likes: 29,
    createdAt: '2024-08-30',
  },

  // 한라산 영실 코스
  {
    id: 'rev-yeongsil-1',
    trailId: 'hallasan-yeongsil',
    author: '백록담바라기',
    rating: 5,
    visitDate: '2024년 5월',
    content: '영실기암의 웅장함과 윗세오름 선작지왓의 탁 트인 평원은 언제 봐도 경이롭습니다. 철쭉 시즌에 방문했는데 천상의 화원이 따로 없네요. 오르막 계단 구간만 천천히 호흡 조절하면 초보도 가능합니다.',
    tags: ['#영실기암', '#윗세오름', '#한라산최애'],
    likes: 42,
    createdAt: '2024-05-28',
  },

  // 부산 이기대
  {
    id: 'rev-igidae-1',
    trailId: 'busan-igidae',
    author: '파도소리',
    rating: 5,
    visitDate: '2024=07-10',
    content: '파도 치는 해식절벽 바로 위를 걷는 기분이 짜릿합니다. 날씨가 맑아서 멀리 해운대 엘시티와 대마도까지 희미하게 보였어요. 출렁다리와 오륙도 스카이워크 연계 코스가 훌륭합니다.',
    tags: ['#해안절벽', '#오륙도', '#출렁다리'],
    likes: 26,
    createdAt: '2024-07-10',
  },

  // 설악산 주전골
  {
    id: 'rev-joojeon-1',
    trailId: 'seoraksan-joojeongol',
    author: '단풍사냥꾼',
    rating: 5,
    visitDate: '2024-10-18',
    content: '용소폭포까지 전 구간 무장애 데크로 되어 있어서 유모차나 어르신들도 전혀 부담 없이 설악산의 기암괴석을 만끽할 수 있는 최고의 코스입니다.',
    tags: ['#무장애길', '#용소폭포', '#설악산'],
    likes: 33,
    createdAt: '2024-10-18',
  },
];

const LOCAL_STORAGE_KEY = 'trailfinder_user_reviews';

export function getStoredReviews(): Review[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!saved) return INITIAL_REVIEWS;
    const userReviews: Review[] = JSON.parse(saved);
    // Combine initial and user-created reviews, avoiding duplicates by id
    const ids = new Set(userReviews.map((r) => r.id));
    const merged = [...userReviews, ...INITIAL_REVIEWS.filter((r) => !ids.has(r.id))];
    return merged;
  } catch {
    return INITIAL_REVIEWS;
  }
}

export function saveUserReview(newReview: Review): Review[] {
  try {
    const all = getStoredReviews();
    const updated = [newReview, ...all.filter((r) => r.id !== newReview.id)];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save review:', e);
    return [newReview, ...INITIAL_REVIEWS];
  }
}

export function toggleReviewLike(reviewId: string): Review[] {
  try {
    const all = getStoredReviews();
    const updated = all.map((r) => (r.id === reviewId ? { ...r, likes: r.likes + 1 } : r));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return INITIAL_REVIEWS;
  }
}

export function deleteStoredReview(reviewId: string): Review[] {
  try {
    const all = getStoredReviews();
    const updated = all.filter((r) => r.id !== reviewId);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return INITIAL_REVIEWS;
  }
}
