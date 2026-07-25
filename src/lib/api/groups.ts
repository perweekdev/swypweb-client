import { api } from '@lib/api-client';
import { toCursorPage } from '@lib/cursor';
import type { InterestGroup } from '@/types/my.types';

/** 그룹 / 관심 그룹 API. 근거: docs/api-reference.md §5 */

interface GroupResponse {
  groupId: number;
  name: string;
  groupImageUrl: string | null;
  /** 전체 목록에만 있음 */
  interested?: boolean;
  /** 관심 목록에만 있음 */
  interestedAt?: string;
}

function toGroup(group: GroupResponse): InterestGroup {
  return {
    id: String(group.groupId),
    name: group.name,
    logoUrl: group.groupImageUrl,
    // 로고 이미지가 없을 때만 쓰이는 placeholder 색
    color: '#E6E8EB',
  };
}

/**
 * 커서 페이지를 끝까지 모아 하나의 배열로 돌려준다.
 * 아티스트 그룹은 수가 적어 1~2회 요청이면 끝난다. (목록 UI가 단순해진다)
 *
 * ⚠️ 다음 커서 필드명이 API마다 `nextCursor`/`newCursor`로 갈리는데 toCursorPage가 흡수한다.
 */
async function fetchAllGroups(path: string): Promise<InterestGroup[]> {
  const collected: InterestGroup[] = [];
  let cursor: number | undefined;

  // 무한 루프 방지 상한(그룹 수 대비 충분).
  for (let page = 0; page < 20; page += 1) {
    const raw = await api.get<unknown>(path, { query: { cursor, size: 50 } });
    const { items, nextCursor, hasNext } = toCursorPage<GroupResponse, number>(raw, 'groups');

    collected.push(...items.map(toGroup));
    if (!hasNext || nextCursor === null) break;
    cursor = nextCursor;
  }

  return collected;
}

/** 5.1 전체 그룹 목록 (관심 그룹 편집 화면) */
export function getAllGroups() {
  return fetchAllGroups('/users/groups');
}

/** 5.2 내 관심 그룹 목록 (⚠️ 다음 커서 필드가 `newCursor`) */
export function getInterestGroups() {
  return fetchAllGroups('/users/me/interest-groups');
}

/** 5.3 관심 미등록 그룹 목록 */
export function getNonInterestGroups() {
  return fetchAllGroups('/users/me/non-interest-groups');
}

/** 5.4 관심 그룹 일괄 추가 — ⚠️ `PATCH`가 아니라 **POST** */
export function addInterestGroups(groupIds: number[]) {
  return api.post<unknown>('/users/me/interest-groups', { groupIds });
}

/** 5.5 관심 그룹 삭제 */
export function removeInterestGroup(groupId: number) {
  return api.delete<{ groupId: number }>(`/users/me/interest-groups/${groupId}`);
}
