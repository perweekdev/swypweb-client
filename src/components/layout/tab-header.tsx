/**
 * 탭 루트 화면(홈/채팅/마이 등)의 상단 타이틀 바 (내비바).
 * 스크롤 시 상단 고정(sticky top-0). 풀스크린 화면은 `Header`(뒤로가기형)를 쓰며 그쪽도 sticky다.
 * 내비바가 있는 모든 페이지가 동일하게 고정되도록 공유 컴포넌트로 둔다.
 */
export function TabHeader({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-20 bg-background px-4 pb-2 pt-4">
      <h1 className="text-h1 text-secondary-900">{title}</h1>
    </header>
  );
}
