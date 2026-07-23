import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  /** 온보딩(ONB-001)에서 입력한 닉네임. BE 연동 전까지 회원 정보의 유일한 소스다. */
  nickname: string | null;
  setAccessToken: (token: string | null) => void;
  setNickname: (nickname: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isAuthenticated: false,
  nickname: null,
  setAccessToken: (token) => set({ accessToken: token, isAuthenticated: !!token }),
  setNickname: (nickname) => set({ nickname }),
  logout: () => set({ accessToken: null, isAuthenticated: false, nickname: null }),
}));
