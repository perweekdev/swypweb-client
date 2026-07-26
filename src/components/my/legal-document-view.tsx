'use client';

import { useQuery } from '@tanstack/react-query';
import Markdown from 'react-markdown';
import { Header } from '@components/layout/header';
import { EmptyState } from '@components/common/empty-state';
import { getLegalDocument, type LegalDocumentType } from '@lib/api/terms';
import { queryKeys } from '@lib/query-keys';
import { parseServerDate } from '@utils/server-date';

/**
 * MY-005 개인정보 처리방침 / MY-006 이용약관 (조회 전용).
 *
 * ⚠️ **디자인 미핸드오프.** 서버가 본문을 **마크다운**으로 주므로 디자인 시스템 토큰에 맞춰
 * 최소 스타일만 매핑해 두었다. 시안이 나오면 이 매핑만 교체하면 된다.
 */

/** 마크다운 요소 → 디자인 시스템 타이포 매핑 */
const MARKDOWN_COMPONENTS = {
  h1: (props: { children?: React.ReactNode }) => (
    <h2 className="mt-6 text-h3 text-secondary-900 first:mt-0">{props.children}</h2>
  ),
  h2: (props: { children?: React.ReactNode }) => (
    <h3 className="mt-5 text-body1 text-secondary-900">{props.children}</h3>
  ),
  h3: (props: { children?: React.ReactNode }) => (
    <h4 className="mt-4 text-body2 text-secondary-900">{props.children}</h4>
  ),
  p: (props: { children?: React.ReactNode }) => (
    <p className="mt-2 text-body2 leading-relaxed text-secondary-700">{props.children}</p>
  ),
  ul: (props: { children?: React.ReactNode }) => (
    <ul className="mt-2 list-disc space-y-1 pl-5">{props.children}</ul>
  ),
  ol: (props: { children?: React.ReactNode }) => (
    <ol className="mt-2 list-decimal space-y-1 pl-5">{props.children}</ol>
  ),
  li: (props: { children?: React.ReactNode }) => (
    <li className="text-body2 leading-relaxed text-secondary-700">{props.children}</li>
  ),
  hr: () => <hr className="my-5 border-secondary-50" />,
  strong: (props: { children?: React.ReactNode }) => (
    <strong className="font-medium text-secondary-900">{props.children}</strong>
  ),
  a: (props: { children?: React.ReactNode; href?: string }) => (
    <a
      href={props.href}
      target="_blank"
      rel="noreferrer"
      className="text-primary-900 underline underline-offset-2"
    >
      {props.children}
    </a>
  ),
};

function formatUpdatedAt(value: string): string {
  const date = parseServerDate(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function LegalDocumentView({ type, title }: { type: LegalDocumentType; title: string }) {
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.terms.document(type),
    queryFn: () => getLegalDocument(type),
    // 약관은 거의 바뀌지 않는다 — 세션 동안 다시 부르지 않는다.
    staleTime: Infinity,
    throwOnError: false,
  });

  return (
    <>
      <Header title={title} />

      {isPending && (
        <p className="flex-1 px-4 py-10 text-center text-body2 text-secondary-500">
          불러오는 중...
        </p>
      )}

      {isError && (
        <EmptyState title="문서를 불러오지 못했어요." description="잠시 후 다시 시도해주세요." />
      )}

      {data && (
        <article className="flex-1 px-4 pb-10 pt-2">
          <Markdown components={MARKDOWN_COMPONENTS}>{data.content}</Markdown>
          {data.updatedAt && (
            <p className="mt-8 text-body3 text-secondary-300">
              최종 수정일 {formatUpdatedAt(data.updatedAt)}
            </p>
          )}
        </article>
      )}
    </>
  );
}
