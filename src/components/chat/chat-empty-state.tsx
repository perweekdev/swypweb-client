import Link from 'next/link';
import { Button } from '@components/ui/button';
import { ROUTES } from '@constants/routes';

/**
 * CHAT-001의 빈 상태 (디자인 `CHAT-005.png`).
 * 스토리보드상 별도 화면이 아니라 채팅 목록의 상태다.
 */
export function ChatEmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 pb-16">
      <p className="text-h3 text-black">아직 나눈 대화가 없어요</p>
      <p className="mt-1 whitespace-pre-line text-center text-body3 text-gray-700">
        {'매칭된 유저에게 제안을 보내면\n채팅을 시작할 수 있어요'}
      </p>
      {/* 스토리보드: '내교환 확인하기' → 교환 메인(EX-001). EX 도메인은 아직 placeholder다. */}
      <Link href={ROUTES.exchange} className="mt-4">
        <Button variant="primary" size="sm" className="py-2.5">
          내교환 확인하기
        </Button>
      </Link>
    </div>
  );
}
