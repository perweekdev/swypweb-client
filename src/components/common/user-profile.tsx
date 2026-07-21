import { Avatar } from '@components/ui/avatar';
import { Button } from '@components/ui/button';

/**
 * 사용자 프로필 행 (user-profile). 아바타 + 이름(+관심그룹) + 우측 액션.
 *   editable — '프로필 편집하기' (관심그룹 표시)
 *   offer    — '제안하기' (홈 피드/교환 상대)
 *   info     — 버튼 없음, 조회용 (교환글 상세 작성자)
 */
export function UserProfile({
  name,
  avatarColor,
  groups,
  variant,
  onAction,
  className = '',
}: {
  name: string;
  avatarColor?: string;
  groups?: string;
  variant: 'editable' | 'offer' | 'info';
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Avatar className="size-12 shrink-0" color={avatarColor} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-button1 text-secondary-900">{name}</p>
        {groups && <p className="truncate text-body3 text-secondary-500">{groups}</p>}
      </div>
      {variant !== 'info' && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {variant === 'offer' ? '제안하기' : '프로필 편집하기'}
        </Button>
      )}
    </div>
  );
}
