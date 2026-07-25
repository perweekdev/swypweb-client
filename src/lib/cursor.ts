import type { CursorPage } from '@/types/api.types';

/**
 * 커서 페이지네이션 응답 정규화. 근거: docs/api-reference.md §1.6
 *
 * 서버 원본이 API마다 두 가지로 갈린다.
 *  - 아이템 배열의 키가 다르다: `groups`, `photoCards`, `messages` …
 *  - 다음 커서 필드명이 다르다: `nextCursor` / `newCursor`
 *    (`newCursor`는 관심 그룹 목록 하나뿐 — §5.2)
 *
 * 도메인 훅이 이 차이를 매번 신경 쓰지 않도록 { items, nextCursor, hasNext }로 통일한다.
 */
export function toCursorPage<T, TCursor extends number | string = number>(
  raw: unknown,
  itemsKey: string
): CursorPage<T, TCursor> {
  if (typeof raw !== 'object' || raw === null) {
    return { items: [], nextCursor: null, hasNext: false };
  }

  const source = raw as Record<string, unknown>;
  const items = source[itemsKey];
  // 서버가 커서를 안 주면(마지막 페이지) null이 온다.
  const cursor = source.nextCursor ?? source.newCursor ?? null;

  return {
    items: Array.isArray(items) ? (items as T[]) : [],
    nextCursor: (cursor as TCursor | null) ?? null,
    hasNext: source.hasNext === true,
  };
}

/**
 * 무한 스크롤에서 다음 페이지 파라미터를 계산한다.
 * hasNext가 false거나 커서가 없으면 undefined를 반환해 더 이상 요청하지 않게 한다.
 * (TanStack Query의 getNextPageParam 규약)
 */
export function getNextCursorParam<T, TCursor extends number | string>(
  page: CursorPage<T, TCursor>
): TCursor | undefined {
  if (!page.hasNext || page.nextCursor === null) return undefined;
  return page.nextCursor;
}
