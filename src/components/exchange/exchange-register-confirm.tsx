'use client';

import { useRouter } from 'next/navigation';
import { Header } from '@components/layout/header';
import { Button } from '@components/ui/button';
import { ExchangeCardSections } from '@components/common/exchange-card-sections';
import { useExchangeDraftStore } from '@store/exchange-draft-store';
import { ROUTES } from '@constants/routes';
import { toCollectionCards } from '@/mocks/collection';

/**
 * EX-008 교환 세트 확인. 등록 직전 있어요/구해요를 3열로 훑어보고 등록한다.
 * 계측: 제목 20 semibold `#000000` 2줄(줄 간격 24) · 하단 CTA 343×56 rounded-xl primary-900.
 */
export function ExchangeRegisterConfirm() {
  const router = useRouter();
  const { haveIds, wantIds, register } = useExchangeDraftStore();

  const haveCards = toCollectionCards(haveIds);
  const wantCards = toCollectionCards(wantIds);
  const canRegister = haveCards.length > 0 && wantCards.length > 0;

  const onRegister = () => {
    // TODO: 실제 교환 세트 등록 API. 현재는 세션 한정으로 스토어에 담는다.
    register({ id: `set-${Date.now()}`, haveCards, wantCards });
    router.push(ROUTES.exchange);
  };

  return (
    <>
      <Header title="교환 세트 확인" />

      <div className="flex-1 px-4 pb-6">
        <p className="whitespace-pre-line text-h1 leading-tight text-black">
          {'등록될 교환 세트를\n확인해주세요'}
        </p>
        <ExchangeCardSections className="mt-6" haveCards={haveCards} wantCards={wantCards} />
      </div>

      <div className="sticky bottom-0 bg-background px-4 pb-8 pt-3">
        <Button size="lg" disabled={!canRegister} onClick={onRegister}>
          등록하기
        </Button>
      </div>
    </>
  );
}
