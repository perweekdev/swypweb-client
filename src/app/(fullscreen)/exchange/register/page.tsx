import { Suspense } from 'react';
import { ExchangeRegisterEditor } from '@components/exchange/exchange-register-editor';

/** EX-007 교환 세트 등록 (대상 그룹은 `?group=` 쿼리로 받는다) */
export default function ExchangeRegisterPage() {
  return (
    <Suspense>
      <ExchangeRegisterEditor />
    </Suspense>
  );
}
