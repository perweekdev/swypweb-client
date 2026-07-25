'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAlbums,
  getGroupCollectionTree,
  getPhotocards,
  getVersions,
  saveOwnedPhotocards,
} from '@lib/api/collections';
import { queryKeys } from '@lib/query-keys';
import { useAuthStore } from '@store/auth-store';

/**
 * 컬렉션 트리 단계별 조회.
 * 각 훅은 해당 단계가 **화면에 펼쳐질 때만** 호출된다(아코디언이 닫히면 컴포넌트가 언마운트됨).
 * 인증이 필요하므로 세션 복구(`hydrated`) 후에만 요청한다.
 */
function useAuthReady() {
  const hydrated = useAuthStore((s) => s.hydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return hydrated && isAuthenticated;
}

export function useCollectionAlbums(groupId: number | null) {
  const ready = useAuthReady();

  return useQuery({
    queryKey: queryKeys.collections.albums(groupId ?? 0),
    queryFn: () => getAlbums(groupId as number),
    enabled: ready && groupId !== null,
    throwOnError: false,
  });
}

export function useAlbumVersions(albumId: number) {
  const ready = useAuthReady();

  return useQuery({
    queryKey: queryKeys.collections.versions(albumId),
    queryFn: () => getVersions(albumId),
    enabled: ready,
    throwOnError: false,
  });
}

export function useVersionPhotocards(versionId: number) {
  const ready = useAuthReady();

  return useQuery({
    queryKey: queryKeys.collections.photocards(versionId),
    queryFn: () => getPhotocards(versionId),
    enabled: ready,
    throwOnError: false,
  });
}

/**
 * COL-003 편집용 전체 트리.
 * 저장이 그룹 전체를 덮어쓰므로 편집 화면은 안 펼친 앨범까지 모두 알고 있어야 한다.
 */
export function useGroupCollectionTree(groupId: number | null) {
  const ready = useAuthReady();

  return useQuery({
    queryKey: queryKeys.collections.tree(groupId ?? 0),
    queryFn: () => getGroupCollectionTree(groupId as number),
    enabled: ready && groupId !== null,
    throwOnError: false,
  });
}

/** 저장 성공 시 조회 트리(COL-001)까지 함께 갱신한다. */
export function useSaveCollection(groupId: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (photoCardIds: number[]) => saveOwnedPhotocards(groupId as number, photoCardIds),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.collections.all }),
  });
}
