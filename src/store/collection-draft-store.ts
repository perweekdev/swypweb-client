import { create } from 'zustand';

/**
 * COL-003 → COL-001 저장 완료 신호.
 *
 * 보유 목록 자체는 **서버가 원본**이다(컬렉션 API 연동 이후).
 * 이 스토어는 편집 완료 후 COL-001에서 '컬렉션이 변경되었어요' 토스트를 한 번 띄우기 위한
 * 1회성 플래그만 들고 있다.
 */
interface CollectionDraftState {
  justSaved: boolean;
  /** COL-003 '완료' 저장 성공 시 호출 */
  markSaved: () => void;
  /** 토스트를 띄운 뒤 플래그 소비 */
  consumeSaved: () => void;
}

export const useCollectionDraftStore = create<CollectionDraftState>((set) => ({
  justSaved: false,
  markSaved: () => set({ justSaved: true }),
  consumeSaved: () => set({ justSaved: false }),
}));
