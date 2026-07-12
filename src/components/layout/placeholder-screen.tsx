/**
 * 아직 디자인/구현되지 않은 화면용 임시 플레이스홀더.
 * 탭 네비게이션이 404 없이 동작하도록 자리만 채운다.
 */
export function PlaceholderScreen({ title }: { title: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 text-center">
      <p className="text-h3 text-secondary-900">{title}</p>
      <p className="text-body3 text-secondary-300">곧 제공될 화면입니다</p>
    </div>
  );
}
