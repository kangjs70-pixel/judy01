import React from 'react';
import { X, ShieldAlert, HeartHandshake, Phone, Sun, Thermometer, Compass, Footprints } from 'lucide-react';

interface SafetyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyGuideModal: React.FC<SafetyGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div
        id="safety-guide-modal"
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col border border-stone-200 text-stone-800"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-stone-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700/80 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">안전 트래킹 & LNT 에티켓 가이드</h3>
              <p className="text-xs text-stone-400 mt-0.5">
                자연을 아끼고 안전하게 산행을 즐기는 꿀팁
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

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* LNT Rules */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 space-y-3">
            <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-emerald-700" />
              <span>Leave No Trace (흔적 안 남기기 7대 원칙)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-700">
              <div className="p-2 bg-white rounded-xl border border-emerald-100">
                <span className="font-bold text-emerald-800">1. 사전 계획 및 준비하기</span>
                <p className="text-[11px] text-stone-500 mt-0.5">날씨, 코스 소요시간, 일몰시간 미리 확인</p>
              </div>
              <div className="p-2 bg-white rounded-xl border border-emerald-100">
                <span className="font-bold text-emerald-800">2. 지정된 탐방로 걷기</span>
                <p className="text-[11px] text-stone-500 mt-0.5">샛길이나 비법정 탐방로 출입 엄금</p>
              </div>
              <div className="p-2 bg-white rounded-xl border border-emerald-100">
                <span className="font-bold text-emerald-800">3. 쓰레기 되가져가기</span>
                <p className="text-[11px] text-stone-500 mt-0.5">과일 껍질이나 음식물 쓰레기도 수거</p>
              </div>
              <div className="p-2 bg-white rounded-xl border border-emerald-100">
                <span className="font-bold text-emerald-800">4. 자연 그대로 보존하기</span>
                <p className="text-[11px] text-stone-500 mt-0.5">야생화, 돌, 나뭇가지 채취 금지</p>
              </div>
            </div>
          </div>

          {/* Walking posture & Knee protection */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
              <Footprints className="w-4 h-4 text-emerald-700" />
              <span>무릎을 지키는 올바른 보행법</span>
            </h4>
            <div className="space-y-2 text-stone-600 leading-relaxed">
              <p>
                &bull; <strong className="text-stone-900">오르막길:</strong> 상체를 살짝 앞으로 숙이고 발바닥 전체로 지면을 디디며 보폭을 좁혀 일정한 리듬으로 걷습니다.
              </p>
              <p>
                &bull; <strong className="text-stone-900">내리막길:</strong> 무릎에 체중의 3~5배 하중이 실립니다. 무릎을 완전히 펴지 않고 살짝 굽힌 채 뒤꿈치부터 착지하며, 등산 스틱으로 무게를 분산하세요.
              </p>
              <p>
                &bull; <strong className="text-stone-900">휴식 타이밍:</strong> 40~50분 걷고 5~10분 쉬는 것이 체력 고갈과 탈수를 막는 가장 이상적인 비율입니다.
              </p>
            </div>
          </div>

          {/* Emergency contacts */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5 mb-2">
              <Phone className="w-4 h-4 text-rose-600" />
              <span>긴급 상황 비상 연락망</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-stone-700 font-medium">
              <div className="p-2 bg-white rounded-xl border border-stone-200 flex items-center justify-between">
                <span>산악 긴급 구조</span>
                <span className="font-bold text-rose-600">119</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-stone-200 flex items-center justify-between">
                <span>국립공원공단 재난안전</span>
                <span className="font-bold text-emerald-700">1670-9221</span>
              </div>
            </div>
            <p className="text-[11px] text-stone-500 mt-2">
              * 국립공원 및 산지 조난 시 코스 내 설치된 국가지점번호판(노란색 표지판) 번호를 알리면 신속한 위치 파악이 가능합니다.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-stone-200 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 text-white font-semibold hover:bg-stone-800 transition"
          >
            확인했습니다
          </button>
        </div>
      </div>
    </div>
  );
};
