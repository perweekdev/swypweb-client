import type { Photocard } from '@/types/photocard.types';

/**
 * 내보내기용 이미지 준비.
 *
 * 캡처 라이브러리에 이미지 로딩을 맡기지 않고 **미리 data URL로 바꿔서** 넘긴다.
 * 그래야 카드마다 자기 이미지가 확실히 들어가고, 캔버스 오염(CORS) 문제도 생기지 않는다.
 */

/** S3 원본을 same-origin 프록시 경로로 바꾼다. */
function toProxyUrl(url: string): string {
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}

async function fetchAsDataUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(toProxyUrl(url));
    if (!response.ok) return null;
    const blob = await response.blob();

    return await new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(typeof reader.result === 'string' ? reader.result : null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

/**
 * 카드 목록의 `imageUrl`을 data URL로 교체한 사본을 돌려준다.
 * 실패한 이미지는 `null`로 두어 색상 placeholder로 렌더된다(전체 실패로 번지지 않게).
 *
 * 같은 URL이 여러 번 나와도 한 번만 받는다.
 */
export async function withInlinedImages(cards: Photocard[]): Promise<Photocard[]> {
  const uniqueUrls = [...new Set(cards.map((card) => card.imageUrl).filter(Boolean))] as string[];
  const entries = await Promise.all(
    uniqueUrls.map(async (url) => [url, await fetchAsDataUrl(url)] as const)
  );
  const dataUrlByOrigin = new Map(entries);

  return cards.map((card) => ({
    ...card,
    imageUrl: card.imageUrl ? (dataUrlByOrigin.get(card.imageUrl) ?? null) : null,
  }));
}
