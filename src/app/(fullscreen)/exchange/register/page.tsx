import { Header } from '@components/layout/header';
import { PlaceholderScreen } from '@components/layout/placeholder-screen';

// 교환 등록 (EX-005~007) — EX 도메인 디자인 핸드오프 전 placeholder.
// 홈 플로팅 CTA '교환 등록하기'의 목적지가 404가 되지 않도록 자리만 채운다.
export default function ExchangeRegisterPage() {
  return (
    <>
      <Header title="교환 등록" />
      <PlaceholderScreen title="교환 등록" />
    </>
  );
}
