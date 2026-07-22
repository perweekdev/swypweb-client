import { Header } from '@components/layout/header';
import { ExchangeSetList } from '@components/exchange/exchange-set-list';
import { mockExchangeSets } from '@/mocks/exchange';

/** EX-003 나의 교환 세트 관리 */
export default function ExchangeSetsPage() {
  return (
    <>
      <Header title="내 교환 세트" />
      <ExchangeSetList initialSets={mockExchangeSets} />
    </>
  );
}
