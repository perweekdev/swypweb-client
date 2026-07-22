import { create } from 'zustand';
import type { ExchangeSide } from '@/types/exchange.types';
import { MAX_CARDS_PER_SIDE } from '@constants/exchange';

/**
 * 교환 세트 등록 드래프트 (EX-007 → EX-008).
 *
 * 등록 화면(선택)과 확인 화면(검토)이 별도 라우트라 화면 간 상태 전달이 필요하다.
 * 있어요/구해요 각 10장이라 쿼리스트링은 부적합 → 클라이언트 스토어로 들고 간다.
 * 뒤로가기로 EX-007에 돌아오면 선택이 그대로 유지되고, 등록 완료 시 `reset()`한다.
 *
 * 선택 순서가 곧 노출 순서라 Set이 아닌 배열로 보관한다.
 */
interface ExchangeDraftState {
  haveIds: string[];
  wantIds: string[];
  /** 이미 담겼으면 해제, 아니면 추가. 축별 최대 10장을 넘으면 무시한다. */
  toggle: (side: ExchangeSide, cardId: string) => void;
  /** 선택 스트립의 X 버튼 — 담긴 포카 제거 */
  remove: (side: ExchangeSide, cardId: string) => void;
  reset: () => void;
}

const key = (side: ExchangeSide) => (side === 'have' ? 'haveIds' : 'wantIds');

export const useExchangeDraftStore = create<ExchangeDraftState>((set) => ({
  haveIds: [],
  wantIds: [],
  toggle: (side, cardId) =>
    set((state) => {
      const field = key(side);
      const ids = state[field];
      if (ids.includes(cardId)) return { [field]: ids.filter((id) => id !== cardId) };
      if (ids.length >= MAX_CARDS_PER_SIDE) return {};
      return { [field]: [...ids, cardId] };
    }),
  remove: (side, cardId) =>
    set((state) => {
      const field = key(side);
      return { [field]: state[field].filter((id) => id !== cardId) };
    }),
  reset: () => set({ haveIds: [], wantIds: [] }),
}));
