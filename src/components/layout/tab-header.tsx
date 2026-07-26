import Image from 'next/image';

/**
 * 탭 루트 화면(홈/컬렉션/내교환/채팅/마이)의 상단 타이틀 바 (내비바).
 * 스크롤 시 상단 고정(sticky top-0). 풀스크린 화면은 `Header`(뒤로가기형)를 쓰며 그쪽도 sticky다.
 * 내비바가 있는 모든 페이지가 동일하게 고정되도록 공유 컴포넌트로 둔다.
 *
 * `logo`: 홈(HOME-001)만 타이틀 자리에 서비스 로고를 쓴다(디자인).
 * 로고 이미지 안에 '포카매치' 워드마크가 포함돼 있어 텍스트를 따로 두지 않고,
 * 제목 의미는 `h1` + `alt`로 유지한다.
 */
export function TabHeader({ title, logo = false }: { title: string; logo?: boolean }) {
  return (
    <header className="sticky top-0 z-20 bg-background px-4 pb-2 pt-4">
      <h1 className="text-h1 text-secondary-900">
        {logo ? (
          // 계측: 로고 원본 95×32 (아이콘 + 워드마크 한 세트)
          <Image src="/logo.png" alt={title} width={95} height={32} priority />
        ) : (
          title
        )}
      </h1>
    </header>
  );
}
