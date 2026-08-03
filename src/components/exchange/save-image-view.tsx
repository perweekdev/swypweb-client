'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { toPng } from 'html-to-image';
import { Header } from '@components/layout/header';
import { Button } from '@components/ui/button';
import { EmptyState } from '@components/common/empty-state';
import { Toast } from '@components/common/toast';
import { ExchangeSetExport, EXPORT_IMAGE_WIDTH } from '@components/exchange/exchange-set-export';
import { getTradeSetDetail } from '@lib/api/trade-sets';
import { withInlinedImages } from '@lib/image-export';
import { queryKeys } from '@lib/query-keys';
import type { Photocard } from '@/types/photocard.types';

interface ExportSource {
  haveCards: Photocard[];
  wantCards: Photocard[];
}

/**
 * EX-010 이미지 확인 → 저장.
 *
 * 저장할 이미지는 화면에 보이는 미리보기가 아니라 **고정 폭으로 따로 그린 노드**(`ExchangeSetExport`)를
 * 캡처한 것이다. 기기 폭에 따라 결과가 달라지지 않게 하기 위함이다.
 * 캡처 대상은 화면 밖(`left:-9999px`)에 두되 **display:none은 쓰지 않는다** — 숨기면 렌더되지 않아 캡처가 빈다.
 */
export function SaveImageView() {
  const tradeSetId = String(useParams().id ?? '');
  const exportRef = useRef<HTMLDivElement>(null);

  const [source, setSource] = useState<ExportSource | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.tradeSets.detail(tradeSetId),
    queryFn: () => getTradeSetDetail(tradeSetId),
    enabled: tradeSetId.length > 0,
    throwOnError: false,
  });

  // 1단계: 카드 이미지를 미리 data URL로 바꾼다(캡처 시 로딩 지연/누락을 없앤다).
  useEffect(() => {
    if (!data) return;

    let cancelled = false;
    void (async () => {
      const [haveCards, wantCards] = await Promise.all([
        withInlinedImages(data.haveCards),
        withInlinedImages(data.wantCards),
      ]);
      if (!cancelled) setSource({ haveCards, wantCards });
    })();

    return () => {
      cancelled = true;
    };
  }, [data]);

  // 2단계: 준비된 노드를 캡처한다.
  useEffect(() => {
    if (!source || !exportRef.current) return;

    let cancelled = false;
    const capture = async () => {
      try {
        const url = await toPng(exportRef.current as HTMLElement, {
          pixelRatio: 2,
          backgroundColor: '#ffffff',
          width: EXPORT_IMAGE_WIDTH,
        });
        if (!cancelled) setPreviewUrl(url);
      } catch {
        if (!cancelled) setError('이미지를 만들지 못했어요. 잠시 후 다시 시도해주세요.');
      }
    };

    // data URL이라 즉시 그려지지만, 레이아웃이 확정된 다음 프레임에 캡처한다.
    const timer = setTimeout(capture, 100);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [source]);

  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(false), 3000);
    return () => clearTimeout(timer);
  }, [saved]);

  const save = () => {
    if (!previewUrl) return;
    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = `phocamatch-${tradeSetId}.png`;
    link.click();
    setSaved(true);
  };

  return (
    <>
      <Header title="이미지 확인" />

      {/* flex 컬럼이어야 오류 시 EmptyState가 남은 영역 중앙에 온다 */}
      <div className="flex flex-1 flex-col px-4">
        <p className="whitespace-pre-line pt-2 text-h1 text-black">
          {'저장될 이미지를\n확인해주세요'}
        </p>

        {isError && (
          <EmptyState
            title="교환 세트를 불러오지 못했어요."
            description="삭제되었거나 잠시 문제가 생겼어요."
          />
        )}

        {!isError && (
          // 쉐도우로 이미지 경계를 만든다 — 없으면 흰 배경에 묻혀 크기를 가늠하기 어렵다(디자인 지정)
          <div className="mt-10 overflow-hidden rounded-2xl bg-secondary-50 shadow-card">
            {previewUrl ? (
              // 생성된 결과 이미지 — next/image 최적화 대상이 아니라 data URL이다.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="저장될 교환 세트 이미지" className="w-full" />
            ) : (
              <div className="flex aspect-[343/288] items-center justify-center">
                <p className="text-body2 text-secondary-500">
                  {error ?? (isPending ? '불러오는 중...' : '이미지 만드는 중...')}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-background px-4 pb-8 pt-3">
        <Toast open={saved} className="mb-3" message="이미지가 저장되었어요!" />
        <Button size="lg" disabled={!previewUrl} onClick={save}>
          저장하기
        </Button>
      </div>

      {/* 캡처 전용 노드 — 화면 밖에 두고 그린다 */}
      <div className="pointer-events-none fixed -left-[9999px] top-0" aria-hidden>
        {source && (
          <div ref={exportRef}>
            <ExchangeSetExport haveCards={source.haveCards} wantCards={source.wantCards} />
          </div>
        )}
      </div>
    </>
  );
}
