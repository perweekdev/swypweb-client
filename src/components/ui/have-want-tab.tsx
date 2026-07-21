/**
 * 있어요/구해요 언더라인 탭 (have-want-tab).
 * 계측: active = primary-900 글자 + primary-900 밑줄, inactive = secondary-500 + secondary-50 밑줄.
 * 라벨은 화면마다 다를 수 있어(있어요/구해요·보낼 수 있어요/받을 수 있어요) prop으로 받는다.
 */
type Side = 'have' | 'want';

export function HaveWantTab({
  value,
  onChange,
  haveLabel = '있어요',
  wantLabel = '구해요',
  haveCount,
  wantCount,
  className = '',
}: {
  value: Side;
  onChange: (side: Side) => void;
  haveLabel?: string;
  wantLabel?: string;
  haveCount?: number;
  wantCount?: number;
  className?: string;
}) {
  const tab = (side: Side, label: string, count?: number) => {
    const active = value === side;
    return (
      <button
        type="button"
        onClick={() => onChange(side)}
        className={`flex-1 border-b-2 pb-2.5 text-center text-button1 ${
          active ? 'border-primary-900 text-primary-900' : 'border-secondary-50 text-secondary-500'
        }`}
      >
        {label}
        {count != null && ` ${count}`}
      </button>
    );
  };

  return (
    <div className={`flex ${className}`}>
      {tab('have', haveLabel, haveCount)}
      {tab('want', wantLabel, wantCount)}
    </div>
  );
}
