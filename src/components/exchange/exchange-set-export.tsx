/* eslint-disable @next/next/no-img-element */
import { AppLogo } from '@components/icons/brand';
import type { Photocard } from '@/types/photocard.types';
import { PLACEHOLDER_COLOR } from '@constants/colors';

/**
 * EX-010 '이미지로 저장하기'로 내보낼 이미지의 본체.
 *
 * 화면에 보이는 UI가 아니라 **캡처 대상**이다. 고정 폭(디자인 기준)으로 그려서
 * 기기 화면 크기와 무관하게 항상 같은 결과가 나오도록 한다.
 *
 * ⚠️ 여기서는 `next/image`를 쓰지 않는다.
 * 이미지는 호출부에서 **data URL로 미리 변환해 넘긴다**(`@lib/image-export`).
 * 최적화 경로를 거치면 캡처 시점에 카드별 이미지가 제대로 잡히지 않는 문제가 있었고,
 * data URL은 네트워크 로딩이 없어 캡처 결과가 항상 일정하다.
 *
 * 레이아웃(디자인):
 *  - 좌 '있어요' / 우 '구해요', 가운데 세로 구분선
 *  - 우측 상단에 반투명 로고(워터마크)
 *  - 축의 카드가 **2장 이하면 큰 카드 2열**, 3장 이상이면 **3열 그리드**
 */

const EXPORT_WIDTH = 780;

function ExportCard({ card }: { card: Photocard }) {
  return (
    <div className="min-w-0">
      <div className="flex aspect-[110/129] items-center justify-center rounded-2xl bg-secondary-10">
        {card.imageUrl ? (
          <img
            src={card.imageUrl}
            alt=""
            className="aspect-card h-[86%] rounded object-cover"
            crossOrigin="anonymous"
          />
        ) : (
          <div
            className="aspect-card h-[86%] rounded"
            style={{ backgroundColor: card.color || PLACEHOLDER_COLOR }}
          />
        )}
      </div>

      <div className="mt-2">
        <p className="truncate text-body3 text-secondary-900">{card.memberName}</p>
        <p className="truncate text-body2 text-secondary-900">{card.albumName}</p>
        <p className="truncate text-body3 text-secondary-500">{card.versionName}</p>
      </div>
    </div>
  );
}

function CardGrid({ cards }: { cards: Photocard[] }) {
  // 2장 이하는 카드를 크게 보여준다(디자인: 컴포넌트 최대 140px).
  const columns = cards.length <= 2 ? 2 : 3;

  return (
    <ul
      className="mt-4 grid gap-x-4 gap-y-6"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {cards.map((card) => (
        <li key={card.id} className="max-w-[140px]">
          <ExportCard card={card} />
        </li>
      ))}
    </ul>
  );
}

export function ExchangeSetExport({
  haveCards,
  wantCards,
}: {
  haveCards: Photocard[];
  wantCards: Photocard[];
}) {
  return (
    <div className="bg-white px-8 pb-10 pt-7" style={{ width: EXPORT_WIDTH }}>
      <div className="flex h-8 justify-end">
        {/*
          워터마크. 계측(`docs/designed/logo/이미지 양식 (3xn).png`, 782 폭): 69×18, 투명도 50%.
          래스터(70×24 png)였을 때는 캡처가 2배수라 늘려 그려져 뭉갰다 → 인라인 SVG로 바꿔 해상도를 분리한다.
        */}
        <AppLogo className="h-[18px] w-[69px] text-black opacity-50" />
      </div>

      <div className="mt-2 flex items-start">
        <section className="min-w-0 flex-1 pr-7">
          <h2 className="text-h1 text-secondary-900">있어요</h2>
          <CardGrid cards={haveCards} />
        </section>

        <div className="w-px self-stretch bg-secondary-50" />

        <section className="min-w-0 flex-1 pl-7">
          <h2 className="text-h1 text-secondary-900">구해요</h2>
          <CardGrid cards={wantCards} />
        </section>
      </div>
    </div>
  );
}

export const EXPORT_IMAGE_WIDTH = EXPORT_WIDTH;
