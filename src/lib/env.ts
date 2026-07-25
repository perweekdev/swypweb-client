const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined. Check your .env.local file.');
}

/**
 * WebSocket 주소. 미지정 시 API BaseURL에서 유도한다.
 * (`https://host/api/v1` → `wss://host/ws`)
 *
 * 설정값이 하나뿐이면 로컬/CI/Vercel 어디서든 어긋날 여지가 줄기 때문에 유도를 기본으로 둔다.
 */
function deriveWsUrl(apiBaseUrl: string): string {
  const { origin } = new URL(apiBaseUrl);
  return `${origin.replace(/^http/, 'ws')}/ws`;
}

export const env = {
  API_BASE_URL,
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || deriveWsUrl(API_BASE_URL),
};
