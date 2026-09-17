import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Trekking Consultant & Recommendation API
  // AI Trekking Consultant & Recommendation API
  app.post("/api/ai/recommend", async (req, res) => {
    let getRegionGroundedFallback = (_prefRegion: string, _queryStr: string): any => null;
    try {
      const { userQuery, preferences } = req.body;
      const requestedRegion = (preferences?.region || "").trim();
      const userText = (userQuery || "").toLowerCase();

      // Regional helper to generate precise, grounded recommendations matching user-selected region
      getRegionGroundedFallback = (prefRegion: string, queryStr: string) => {
        const pReg = prefRegion.toLowerCase();
        const q = queryStr.toLowerCase();

        // 1. 제주도
        if (pReg.includes("제주") || q.includes("제주") || q.includes("서귀포") || q.includes("한라산") || q.includes("올레")) {
          return {
            title: "에메랄드빛 바다와 신비로운 화산섬 - 제주 맞춤 트래킹",
            summary: "선택하신 '제주도' 지역의 대표 명품 코스입니다. 해안 절경과 고산 억새·구상나무 숲을 만끽할 수 있습니다.",
            recommendedTrails: [
              {
                name: "제주 올레길 7코스 (제주 서귀포)",
                difficulty: "쉬움 (초급)",
                distance: "17.6km (외돌개~법환 6km 구간 추천)",
                duration: "약 2~3시간",
                highlights: "외돌개 기암절벽, 돔베낭길 상록수림 데크, 푸른 서귀포 바다 파노라마",
                whyRecommended: "제주 올레길 중 바다 경관이 가장 수려하며, 완만한 평지 데크 위주라 남녀노소 누구나 걷기 좋습니다."
              },
              {
                name: "한라산 영실-어리목 트래킹 코스 (제주 서귀포/제주시)",
                difficulty: "보통 (중급)",
                distance: "8.4km",
                duration: "약 4시간",
                highlights: "영실기암 병풍바위, 윗세오름 평전의 백록담 화구벽 조망, 구상나무 숲",
                whyRecommended: "사전 예약 없이도 한라산의 가장 압도적인 고산 비경을 당일치기로 경험할 수 있는 최고의 코스입니다."
              }
            ],
            tips: [
              "제주의 자외선과 바닷바람을 대비해 모자, 선글라스, 얇은 방풍 바람막이를 준비하세요.",
              "제주 240번 버스(영실-어리목 연계) 및 600번 공항리무진을 이용하면 렌터카 없이도 대중교통 이동이 편리합니다.",
              "윗세오름 대피소는 계절별 입산/하산 통제 시간(동절기 12시 등)이 있으므로 이른 오전 출발을 권장합니다."
            ]
          };
        }

        // 2. 경상권 (부산/대구/울산/경북/경남)
        if (pReg.includes("경상") || pReg.includes("부산") || pReg.includes("울산") || q.includes("경상") || q.includes("부산") || q.includes("울산") || q.includes("영남") || q.includes("경주") || q.includes("문경")) {
          return {
            title: "푸른 동남해와 영남알프스 능선 - 경상권 맞춤 트래킹",
            summary: "선택하신 '경상권(부산/울산/경북/경남)' 지역의 최고 명품 코스입니다. 역동적인 해안 절벽과 광활한 고산 능선을 경험해보세요.",
            recommendedTrails: [
              {
                name: "영남알프스 간월재 억새길 (울산 울주)",
                difficulty: "보통 (중급)",
                distance: "11.5km (사슴농장 임도 왕복)",
                duration: "약 4시간",
                highlights: "해발 900m 10만 평 은빛 억새평원, 간월재 대피소 휴게소 뷰",
                whyRecommended: "배내골 사슴농장 방면 임도를 이용하면 완만한 경사로 초보자도 10만 평 고산 억새평원에 오를 수 있습니다."
              },
              {
                name: "부산 이기대 해안산책로 (부산 남구)",
                difficulty: "보통 (중급)",
                distance: "4.7km",
                duration: "약 2시간",
                highlights: "해식절벽, 광안대교 및 해운대 마린시티 파노라마, 오륙도 스카이워크",
                whyRecommended: "동해와 남해가 만나는 파도 소리를 들으며 해안 절벽길을 걷는 대한민국 대표 해안 둘레길입니다."
              }
            ],
            tips: [
              "간월재 정상은 바람이 강하게 불어 기온이 낮으므로 여벌의 방풍 자켓을 꼭 챙기세요.",
              "부산 이기대는 계단 구간이 다소 있으므로 쿠션감이 좋은 트래킹화를 추천합니다.",
              "울산역(KTX)과 부산 지하철 2호선에서 시내버스 환승으로 쉽게 접근할 수 있습니다."
            ]
          };
        }

        // 3. 전라권 (광주/전남/전북)
        if (pReg.includes("전라") || pReg.includes("전북") || pReg.includes("전남") || q.includes("전라") || q.includes("남원") || q.includes("순천") || q.includes("지리산") || q.includes("담양") || q.includes("광주")) {
          return {
            title: "남도의 맛과 깊은 원시림 - 전라권 맞춤 트래킹",
            summary: "선택하신 '전라권(전북/전남)' 지역의 자연 생태 힐링 명소입니다. 지리산 청정 계곡과 황금빛 갈대습지의 정취를 전해드립니다.",
            recommendedTrails: [
              {
                name: "지리산 뱀사골 계곡 힐링 트래킹 (전북 남원)",
                difficulty: "쉬움 (초급)",
                distance: "9.2km (편도/왕복 선택)",
                duration: "약 3시간 20분",
                highlights: "에메랄드빛 소(沼)와 너럭바위, 천연기념물 와운마을 천년송, 무장애 나눔길",
                whyRecommended: "경사가 완만하고 시원한 계곡물소리가 끊이지 않아 한여름 피서와 가을 단풍 트래킹에 최고입니다."
              },
              {
                name: "순천만 갈대습지길 & 용산전망대 (전남 순천)",
                difficulty: "쉬움 (초급)",
                distance: "5.4km",
                duration: "약 1시간 40분",
                highlights: "540만 평 국내 최대 갈대군락지 데크, 순천만 S자 갯골과 붉은 낙조",
                whyRecommended: "전 구간이 평탄한 목재 데크로 조성되어 무릎 부담이 전혀 없으며, 해질녘 용산전망대 낙조는 감탄을 자아냅니다."
              }
            ],
            tips: [
              "순천만은 일몰 1시간 전에 탐방을 시작하면 황금빛 갈대와 낙조를 동시에 만끽할 수 있습니다.",
              "남원역 KTX 및 순천역 KTX에서 시내버스가 직통 연결되어 뚜벅이 여행객에게도 편리합니다.",
              "트래킹 후 남원 추어탕이나 순천 꼬막정식 등 남도 별미 식도락을 함께 즐겨보세요."
            ]
          };
        }

        // 4. 충청권 (충북/충남/대전/세종)
        if (pReg.includes("충청") || pReg.includes("충북") || pReg.includes("충남") || q.includes("충청") || q.includes("괴산") || q.includes("태안") || q.includes("단양") || q.includes("대전")) {
          return {
            title: "호수와 솔향기 가득한 옛길 - 충청권 맞춤 트래킹",
            summary: "선택하신 '충청권(충북/충남)' 지역의 대표 호반 및 옛길 트래킹 명소입니다. 잔잔한 물결과 맑은 솔바람을 느껴보세요.",
            recommendedTrails: [
              {
                name: "괴산 산막이옛길 & 충청도양반길 (충북 괴산)",
                difficulty: "쉬움 (초급)",
                distance: "4.0km",
                duration: "약 1시간 30분",
                highlights: "괴산호 호숫가 친환경 목재 데크, 소나무 출렁다리, 산막이 나룻배 유람선",
                whyRecommended: "호수를 끼고 완만한 숲길을 걸은 뒤, 돌아올 때는 유람선을 타고 물살을 가르는 낭만을 즐길 수 있습니다."
              },
              {
                name: "단양 느림보강물길 & 수양개 잔도 (충북 단양)",
                difficulty: "쉬움 (초급)",
                distance: "4.2km",
                duration: "약 1시간 30분",
                highlights: "남한강 절벽에 매달린 1.2km 잔도길, 만천하스카이워크 연계, 강변 파노라마",
                whyRecommended: "남한강 암벽 절벽 위를 허공에 뜬 채로 걷는 짜릿함과 평탄한 보행로가 결합된 최고의 강변 코스입니다."
              }
            ],
            tips: [
              "괴산 산막이옛길은 편도로 걷고 산막이선착장에서 배를 타고 출발지로 복귀하는 코스를 추천합니다.",
              "괴산터미널 및 단양역에서 대중교통 접근이 용이합니다.",
              "산막이마을에서 판매하는 올갱이국이나 감자전 등 로컬 별미를 곁들이면 더욱 좋습니다."
            ]
          };
        }

        // 5. 강원권 (평창/양양/인제/강릉/춘천)
        if (pReg.includes("강원") || q.includes("강원") || q.includes("평창") || q.includes("양양") || q.includes("인제") || q.includes("설악") || q.includes("오대산")) {
          return {
            title: "청정 백두대간과 원시림 숲길 - 강원권 맞춤 트래킹",
            summary: "선택하신 '강원권' 지역의 대한민국 대표 국립공원 명품 숲길입니다. 울창한 전나무와 자작나무의 청정한 피톤치드를 선사합니다.",
            recommendedTrails: [
              {
                name: "오대산 선재길 (강원 평창)",
                difficulty: "쉬움 (초급)",
                distance: "9.0km",
                duration: "약 3시간 30분",
                highlights: "월정사 천년 전나무 숲길, 맑디맑은 오대천 계곡, 전통 섶다리, 상원사",
                whyRecommended: "전 구간이 부드러운 흙길과 데크로 이루어진 완만한 숲길로, 맑은 물소리와 피톤치드 속에서 힐링하기에 최적입니다."
              },
              {
                name: "설악산 주전골-흘림골 계곡길 (강원 양양)",
                difficulty: "쉬움 (초급)",
                distance: "3.5km",
                duration: "약 1시간 30분",
                highlights: "오색약수터, 독주암 기암괴석, 옥빛 선녀탕, 웅장한 용소폭포",
                whyRecommended: "험준한 설악산에서 가장 편안하고 안전하게 남설악의 비경을 감상할 수 있어 가족 동반에 적극 추천합니다."
              }
            ],
            tips: [
              "KTX 진부(오대산)역에서 월정사행 버스가 정기 운행되어 수도권에서 당일치기 산행이 충분합니다.",
              "오색약수터에서 톡 쏘는 탄산 철분 약수를 한 모금 마셔보고 출발하세요.",
              "선재길 상원사 종점에서는 월정사 주차장으로 복귀하는 시내버스를 이용할 수 있습니다."
            ]
          };
        }

        // 6. 수도권 (서울/경기/인천)
        if (pReg.includes("서울") || pReg.includes("경기") || pReg.includes("수도권") || q.includes("서울") || q.includes("경기") || q.includes("수도권") || q.includes("북한산") || q.includes("인왕산") || q.includes("남한산성")) {
          return {
            title: "지하철로 닿는 자연과 역사 - 수도권 맞춤 트래킹",
            summary: "선택하신 '수도권(서울/경기)' 지역의 인기 코스입니다. 도심 대중교통으로 가볍게 찾아가는 숲길과 성곽 조망을 추천합니다.",
            recommendedTrails: [
              {
                name: "북한산 둘레길 우이령길 (서울 강북 / 경기 양주)",
                difficulty: "쉬움 (초급)",
                distance: "6.8km",
                duration: "약 2시간 30분",
                highlights: "도봉산 오봉 파노라마 전망대, 예약제로 운영되는 보존된 청정 숲, 넓은 흙길",
                whyRecommended: "우이신설선 지하철역에서 도보로 연결되며, 넓고 완만한 흙길 임도라 무릎 부담 없이 호젓하게 걸을 수 있습니다."
              },
              {
                name: "인왕산 한양도성 성곽길 (서울 종로)",
                difficulty: "보통 (중급)",
                distance: "4.5km",
                duration: "약 2시간",
                highlights: "조선 600년 성곽, 범바위, 광화문·남산타워·청와대 360도 도심 파노라마",
                whyRecommended: "지하철 3호선(독립문/경복궁역)과 바로 연결되며, 짧은 산행 시간 대비 서울 최고의 일몰과 야경을 자랑합니다."
              },
              {
                name: "남한산성 성곽길 1코스 (경기 광주/성남)",
                difficulty: "쉬움 (초급)",
                distance: "3.8km",
                duration: "약 1시간 20분",
                highlights: "유네스코 세계문화유산 성곽, 수어장대, 잠실 롯데타워 조망",
                whyRecommended: "지하철 8호선 산성역에서 버스로 환승해 산성로터리에서 출발하며, 남녀노소 편안하게 걸을 수 있는 역사 명소입니다."
              }
            ],
            tips: [
              "북한산 우이령길은 국립공원공단 예약시스템을 통해 사전 탐방 예약이 필요합니다.",
              "인왕산은 해질녘 오후 5시경 방문하면 붉은 노을과 화려한 서울 야경을 동시에 감상할 수 있습니다.",
              "대중교통(우이신설선, 3호선, 8호선) 연계가 뛰어나 자차 없이 가기에 가장 편리합니다."
            ]
          };
        }

        // 7. 기본 전국 통합 큐레이션 (선호 테마/풍경 반영)
        if (q.includes("바다") || q.includes("해안")) {
          return {
            title: "파도 소리와 함께 걷는 전국 명품 해안길 추천",
            summary: "바다 조망 요청에 맞춰 탁 트인 에메랄드빛 오션뷰를 선사하는 대표 해안 둘레길을 엄선했습니다.",
            recommendedTrails: [
              {
                name: "제주 올레길 7코스 (제주 서귀포)",
                difficulty: "쉬움 (초급)",
                distance: "17.6km (외돌개~법환 6km 추천)",
                duration: "약 2~3시간",
                highlights: "외돌개 기암절벽, 돔베낭길 상록수림, 푸른 서귀포 바다 파노라마",
                whyRecommended: "제주 올레길 중 바다 경관이 가장 수려하며 완만한 데크로 조성되어 있습니다."
              },
              {
                name: "부산 이기대 해안산책로 (부산 남구)",
                difficulty: "보통 (중급)",
                distance: "4.7km",
                duration: "약 2시간",
                highlights: "해식절벽, 광안대교 & 해운대 마린시티 뷰, 오륙도 스카이워크",
                whyRecommended: "동해와 남해가 만나는 파도 소리를 들으며 다이내믹한 해안 절경을 만끽할 수 있습니다."
              }
            ],
            tips: [
              "해안길은 바람이 강하고 그늘이 적을 수 있으므로 자외선 차단제와 모자를 준비하세요.",
              "바위 구간이 미끄러울 수 있으므로 접지력이 좋은 신발을 착용하세요."
            ]
          };
        }

        return {
          title: "큐레이터 엄선 전국 명품 트래킹 코스",
          summary: "자연 속 힐링과 안전하고 쾌적한 보행 환경을 갖춘 대한민국 대표 둘레길을 안내해 드립니다.",
          recommendedTrails: [
            {
              name: "오대산 선재길 (강원 평창)",
              difficulty: "쉬움 (초급)",
              distance: "9.0km",
              duration: "약 3시간 30분",
              highlights: "피톤치드 가득한 계곡 숲길, 전나무 숲과 완만한 흙길/데크",
              whyRecommended: "경사가 완만하고 물소리를 들으며 남녀노소 누구나 걷기 가장 편안한 대한민국 대표 힐링 코스입니다."
            },
            {
              name: "북한산 우이령길 (서울 강북 / 경기 양주)",
              difficulty: "쉬움 (초급)",
              distance: "6.8km",
              duration: "약 2시간 30분",
              highlights: "도봉산 오봉 파노라마 전망, 예약제로 운영되는 한적한 청정 자연림",
              whyRecommended: "수도권에서 대중교통으로 가기 쉽고 넓고 완만한 비포장 임도로 무릎 부담이 적습니다."
            }
          ],
          tips: [
            "수분 보충을 위해 500ml 생수 2병 이상과 간단한 열량 보충 간식을 챙기세요.",
            "발목을 안정적으로 감싸주는 트래킹화나 경등산화 착용을 권장합니다.",
            "산행 시 일몰 2시간 전 하산을 완료할 수 있도록 여유 있게 일정을 계획하세요."
          ]
        };
      };

      if (!process.env.GEMINI_API_KEY) {
        const tailored = getRegionGroundedFallback(requestedRegion, userText);
        return res.status(200).json({
          success: false,
          fallback: true,
          message: "GEMINI_API_KEY가 설정되지 않아 사전 검증된 지역별 공식 큐레이션 데이터를 제공합니다.",
          recommendation: tailored,
        });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const prompt = `당신은 대한민국 최고의 아웃도어 트래킹/등산 전문 큐레이터입니다.
사용자의 질문과 선호도에 맞춰 최적의 트래킹 코스 추천 및 맞춤 팁을 JSON 형식으로 작성해주세요.

[사용자 요청]
${userQuery || "주말에 가기 좋은 힐링 트래킹 코스를 추천해줘."}

[선호 조건]
- 희망 지역: ${requestedRegion || "전국"}
- 선호 난이도: ${preferences?.difficulty || "무관"}
- 테마: ${preferences?.theme || "자연/경관"}
- 동행인/상황: ${preferences?.companion || "누구나"}

[CRITICAL: 지역 일치 필수 규칙]
- 만약 '희망 지역'이 지정되어 있다면 (예: '제주도', '경상권', '전라권', '충청권', '강원권', '수도권(서울/경기)' 등), 추천하는 모든 코스는 반드시 해당 지역에 위치해야 합니다!
- 절대 다른 지역의 코스를 추천하지 마십시오 (예: 사용자가 '제주도'를 골랐는데 서울이나 강원도 코스를 추천하는 것은 심각한 오류입니다).
- 코스 이름 뒤에 반드시 '(지역 행정구역)'을 표기하십시오. 예: 제주 올레길 7코스 (제주 서귀포), 영남알프스 간월재 (울산 울주), 지리산 뱀사골 (전북 남원), 괴산 산막이옛길 (충북 괴산).

반드시 다음 JSON 형식에 정확히 맞춰서 응답하세요. 백틱(\`\`\`json) 코드블록을 포함해도 좋습니다:
{
  "title": "요청에 어울리는 추천 타이틀 (예: '제주 푸른 바다와 함께하는 해안 둘레길')",
  "summary": "간결한 추천 요약 및 총평 (2~3문장)",
  "recommendedTrails": [
    {
      "name": "코스 이름 및 위치 (예: 제주 올레길 7코스 (제주 서귀포))",
      "difficulty": "초급 / 중급 / 상급",
      "distance": "거리 (예: 17.6km)",
      "duration": "소요 시간 (예: 약 3시간 30분)",
      "highlights": "핵심 매력 및 경관 특징",
      "whyRecommended": "이 사용자 요청에 추천하는 구체적 이유"
    },
    {
      "name": "두 번째 추천 코스 이름",
      "difficulty": "초급 / 중급 / 상급",
      "distance": "거리",
      "duration": "소요 시간",
      "highlights": "핵심 매력",
      "whyRecommended": "추천 이유"
    }
  ],
  "tips": [
    "트래킹 시 꼭 챙겨야 할 준비물이나 팁 1",
    "교통편이나 안전 유의사항 팁 2",
    "주변 먹거리나 힐링 스팟 팁 3"
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const responseText = response.text || "{}";
      let parsed;
      try {
        parsed = JSON.parse(responseText);
      } catch (err) {
        const clean = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        parsed = JSON.parse(clean);
      }

      return res.json({
        success: true,
        recommendation: parsed,
      });
    } catch (error: any) {
      console.warn("Gemini API error or overload, providing smart expert fallback:", error?.message || error);
      const tailored = getRegionGroundedFallback(req.body?.preferences?.region || "", req.body?.userQuery || "");
      return res.json({
        success: true,
        fallback: true,
        recommendation: tailored,
      });
    }
  });

  // Vite middleware in development, static files in production
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TrailFinder Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
