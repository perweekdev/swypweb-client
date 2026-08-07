import { create } from 'zustand';

/**
 * 내가 나간 채팅방 id 보관소.
 *
 * **서버 결함 우회다.** 나가기(§8.10)는 `chat_room_members.deleted_at`만 기록하는데,
 * 목록·헤더·메시지·읽음·STOMP 어디에도 이 값을 거르는 조건이 없다.
 * 그래서 나간 뒤에도 방이 목록에 그대로 나오고 대화도 계속 오간다.
 * → 나간 방 id를 여기 모아두고 화면에서 직접 걸러낸다.
 *
 * **한계**: 브라우저 로컬 저장이라 **다른 기기·브라우저에서는 다시 보인다.**
 * 서버가 조회에 `deleted_at IS NULL`을 넣으면 이 우회를 통째로 제거한다.
 *
 * 저장소로 localStorage를 쓰는 이유 — 인증 토큰(sessionStorage)과 달리
 * 탭을 닫아도 유지돼야 하고, 민감정보가 아니라 방 번호일 뿐이다.
 */

const STORAGE_KEY = 'phocamatch.leftChats';

function readStorage(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    // 프라이빗 모드 등에서 접근이 막힐 수 있다. 읽기 실패가 화면을 멈추게 하지는 않는다.
    return [];
  }
}

function writeStorage(ids: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* 무시 */
  }
}

interface LeftChatState {
  ids: string[];
  /**
   * 복구가 끝났는지. 복구 전에는 "나간 방이 없다"와 "아직 모름"을 구분할 수 없어,
   * 이 값이 false인 동안 목록을 그리면 나간 방이 잠깐 보였다 사라진다.
   */
  hydrated: boolean;
  hydrate: () => void;
  /** 나간 방으로 표시한다(여러 개 한 번에). */
  markLeft: (chatIds: string[]) => void;
}

export const useLeftChatStore = create<LeftChatState>((set, get) => ({
  ids: [],
  hydrated: false,

  hydrate: () => set({ ids: readStorage(), hydrated: true }),

  markLeft: (chatIds) => {
    const next = [...new Set([...get().ids, ...chatIds])];
    set({ ids: next });
    writeStorage(next);
  },
}));
