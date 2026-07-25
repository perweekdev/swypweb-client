import { Suspense } from 'react';
import { ExchangeRegisterConfirm } from '@components/exchange/exchange-register-confirm';

/** EX-008 교환 세트 확인 (대상 그룹은 `?group=` 쿼리로 받는다) */
export default function ExchangeRegisterConfirmPage() {
  return (
    <Suspense>
      <ExchangeRegisterConfirm />
    </Suspense>
  );
}
