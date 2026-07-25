import { create } from 'zustand';

/**
 * 인증 상태.
 *
 * 저장소로 **sessionStorage**를 쓴다.
 * - 서버에 리프레시 토큰이 없어(access 1시간) 메모리 보관만 하면 새로고침마다 로그아웃된다.
 * - localStorage 대신 sessionStorage인 이유: XSS로 토큰이 새더라도 노출 창이 **탭 세션**으로 한정된다.
 *
 * SSR/프리렌더 시점에는 항상 비로그인 상태로 렌더되고, 마운트 후 AuthProvider가 hydrate()를 호출해
 * 실제 값을 올린다. (서버 HTML과 첫 클라이언트 렌더를 일치시켜 hydration mismatch를 피한다.)
 */

const STORAGE_KEY = 'phocamatch.auth';

interface PersistedAuth {
  accessToken: string | null;
  nickname: string | null;
  /** 온보딩(ONB-001) 대기용 임시 토큰. 유효 10분. */
  signupToken: string | null;
}

function readStorage(): PersistedAuth | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PersistedAuth) : null;
  } catch {
    // 프라이빗 모드 등에서 접근이 막힐 수 있다. 저장 실패가 앱을 멈추게 하지는 않는다.
    return null;
  }
}

function writeStorage(value: PersistedAuth): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* 무시 */
  }
}

function clearStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* 무시 */
  }
}

interface AuthState extends PersistedAuth {
  isAuthenticated: boolean;
  /**
   * 세션 복구가 끝났는지. 복구 전에는 "비로그인"과 "아직 모름"을 구분할 수 없다.
   *
   * React는 **자식 effect를 부모보다 먼저** 실행하므로, 화면이 마운트되는 시점에는
   * AuthProvider의 hydrate()가 아직 돌지 않았을 수 있다. 토큰 유무로 분기하는 화면은
   * 반드시 이 값이 true가 된 뒤에 판단해야 한다.
   */
  hydrated: boolean;
  /** sessionStorage 값을 스토어로 올린다. 마운트 후 1회만 호출한다(AuthProvider). */
  hydrate: () => void;
  setAccessToken: (token: string | null) => void;
  setSignupToken: (token: string | null) => void;
  setNickname: (nickname: string | null) => void;
  logout: () => void;
}

const EMPTY: PersistedAuth = { accessToken: null, nickname: null, signupToken: null };

export const useAuthStore = create<AuthState>((set, get) => {
  const persist = () => {
    const { accessToken, nickname, signupToken } = get();
    writeStorage({ accessToken, nickname, signupToken });
  };

  return {
    ...EMPTY,
    isAuthenticated: false,
    hydrated: false,

    hydrate: () => {
      const saved = readStorage();
      set({
        accessToken: saved?.accessToken ?? null,
        nickname: saved?.nickname ?? null,
        signupToken: saved?.signupToken ?? null,
        isAuthenticated: Boolean(saved?.accessToken),
        hydrated: true,
      });
    },

    setAccessToken: (token) => {
      set({ accessToken: token, isAuthenticated: Boolean(token) });
      persist();
    },

    setSignupToken: (token) => {
      set({ signupToken: token });
      persist();
    },

    setNickname: (nickname) => {
      set({ nickname });
      persist();
    },

    logout: () => {
      // hydrated는 유지한다 — 복구는 이미 끝났고, 로그아웃이 그것을 되돌리지는 않는다.
      set({ ...EMPTY, isAuthenticated: false });
      clearStorage();
    },
  };
});
