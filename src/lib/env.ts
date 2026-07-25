const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined. Check your .env.local file.');
}

/** 서버 루트. OAuth 시작(`/oauth2/**`)과 WebSocket(`/ws`)은 `/api/v1` 밖에 있다. */
const API_ORIGIN = new URL(API_BASE_URL).origin;

export const env = {
  API_BASE_URL,
  API_ORIGIN,
  /**
   * WebSocket 주소. 미지정 시 API 주소에서 유도한다(`https://host/api/v1` → `wss://host/ws`).
   * 설정값이 하나뿐이면 로컬/CI/Vercel 어디서든 어긋날 여지가 줄기 때문에 유도를 기본으로 둔다.
   */
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || `${API_ORIGIN.replace(/^http/, 'ws')}/ws`,
};
