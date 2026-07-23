import { create } from 'zustand';
import { mockOwnedCardIdsByGroup } from '@/mocks/collection';

/**
 * 컬렉션 보유 상태 (COL-001 ↔ COL-003).
 *
 * 컬렉션 편집은 "그룹의 보유 포카 id 집합을 고치는 화면"이다.
 * 편집 중 선택은 COL-003 화면의 로컬 상태로 두고(취소=뒤로가기 시 그냥 버려진다),
 * `완료`를 눌렀을 때만 이 스토어의 보유 목록에 반영한다.
 *
 * ⚠️ BE 연동 전 임시 보관이다 — 새로고침하면 목 초기값으로 돌아간다.
 */
interface CollectionDraftState {
  /** 그룹별 보유 포카 id (편집 결과가 반영되는 원본) */
  ownedByGroup: Record<string, string[]>;
  /** COL-003 '완료': 그룹의 보유 목록을 교체하고 토스트 플래그를 세운다 */
  save: (groupId: string, cardIds: string[]) => void;

  /** COL-001에서 '컬렉션이 변경되었어요' 토스트를 띄우기 위한 1회성 플래그 */
  justSaved: boolean;
  /** 토스트를 띄운 뒤 플래그 소비 */
  consumeSaved: () => void;
}

export const useCollectionDraftStore = create<CollectionDraftState>((set) => ({
  // TODO: BE 연동 시 컬렉션 조회/저장 API로 교체
  ownedByGroup: { ...mockOwnedCardIdsByGroup },

  save: (groupId, cardIds) =>
    set((state) => ({
      ownedByGroup: { ...state.ownedByGroup, [groupId]: cardIds },
      justSaved: true,
    })),

  justSaved: false,
  consumeSaved: () => set({ justSaved: false }),
}));
