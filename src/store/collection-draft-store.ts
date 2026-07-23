import { create } from 'zustand';
import { mockOwnedCardIdsByGroup } from '@/mocks/collection';

/**
 * 컬렉션 보유/편집 상태 (COL-001 ↔ COL-003).
 *
 * 컬렉션 편집은 "그룹의 보유 포카 id 집합을 고치는 화면"이다.
 * COL-003 진입 시 현재 보유분으로 선택을 채우고(`startEdit`), `완료`를 눌러야 반영한다(`save`).
 * 취소(뒤로가기)하면 선택은 버려지고 보유 목록은 그대로다.
 *
 * ⚠️ BE 연동 전 임시 보관이다 — 새로고침하면 목 초기값으로 돌아간다.
 */
interface CollectionDraftState {
  /** 그룹별 보유 포카 id (편집 결과가 반영되는 원본) */
  ownedByGroup: Record<string, string[]>;
  /** 편집 중인 그룹 id (편집 화면 밖에서는 null) */
  editingGroupId: string | null;
  /** 편집 중 선택 상태 — 그리드 조회가 잦아 Set으로 든다 */
  selectedIds: Set<string>;

  /** COL-001 → COL-003 진입: 현재 보유분으로 선택을 채운다 */
  startEdit: (groupId: string) => void;
  /** 포카 1장 토글 */
  toggle: (cardId: string) => void;
  /** 버전 '전체 선택' — 이미 전부 선택돼 있으면 전체 해제 */
  toggleVersion: (cardIds: string[]) => void;
  /** '완료': 선택 상태를 보유 목록으로 저장하고 토스트 플래그를 세운다 */
  save: () => void;

  /** COL-001에서 '컬렉션이 변경되었어요' 토스트를 띄우기 위한 1회성 플래그 */
  justSaved: boolean;
  /** 토스트를 띄운 뒤 플래그 소비 */
  consumeSaved: () => void;
}

export const useCollectionDraftStore = create<CollectionDraftState>((set) => ({
  // TODO: BE 연동 시 컬렉션 조회 API로 교체
  ownedByGroup: { ...mockOwnedCardIdsByGroup },
  editingGroupId: null,
  selectedIds: new Set(),

  startEdit: (groupId) =>
    set((state) => ({
      editingGroupId: groupId,
      selectedIds: new Set(state.ownedByGroup[groupId] ?? []),
    })),

  toggle: (cardId) =>
    set((state) => {
      const next = new Set(state.selectedIds);
      if (!next.delete(cardId)) next.add(cardId);
      return { selectedIds: next };
    }),

  toggleVersion: (cardIds) =>
    set((state) => {
      const next = new Set(state.selectedIds);
      const allSelected = cardIds.every((id) => next.has(id));
      cardIds.forEach((id) => (allSelected ? next.delete(id) : next.add(id)));
      return { selectedIds: next };
    }),

  save: () =>
    set((state) => {
      if (!state.editingGroupId) return {};
      return {
        ownedByGroup: {
          ...state.ownedByGroup,
          [state.editingGroupId]: [...state.selectedIds],
        },
        editingGroupId: null,
        selectedIds: new Set<string>(),
        justSaved: true,
      };
    }),

  justSaved: false,
  consumeSaved: () => set({ justSaved: false }),
}));
