import { Suspense } from 'react';
import { ExchangeRegisterEntry } from '@components/exchange/exchange-register-entry';

/** EX-007 교환 세트 등록 (대상 그룹은 `?group=`, 없으면 첫 관심 그룹으로 보정) */
export default function ExchangeRegisterPage() {
  return (
    <Suspense>
      <ExchangeRegisterEntry />
    </Suspense>
  );
}
