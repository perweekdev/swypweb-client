'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@constants/routes';
import {
  ChatFilledIcon,
  ChatIcon,
  CollectionFilledIcon,
  CollectionIcon,
  ExchangeIcon,
  HomeFilledIcon,
  HomeIcon,
  UserFilledIcon,
  UserIcon,
} from '@components/icons';

// active는 채운 아이콘, inactive는 선 아이콘. 내교환만 두 상태의 모양이 같아 색으로만 구분한다(디자인).
const TABS = [
  { href: ROUTES.home, label: '홈', Icon: HomeIcon, IconActive: HomeFilledIcon },
  {
    href: ROUTES.collection,
    label: '컬렉션',
    Icon: CollectionIcon,
    IconActive: CollectionFilledIcon,
  },
  { href: ROUTES.exchange, label: '내교환', Icon: ExchangeIcon, IconActive: ExchangeIcon },
  { href: ROUTES.chat, label: '채팅', Icon: ChatIcon, IconActive: ChatFilledIcon },
  { href: ROUTES.my, label: '마이', Icon: UserIcon, IconActive: UserFilledIcon },
] as const;

export function BottomTabNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-10 flex border-t border-secondary-50 bg-background pb-[env(safe-area-inset-bottom)]">
      {TABS.map(({ href, label, Icon, IconActive }) => {
        const active = href === ROUTES.home ? pathname === href : pathname.startsWith(href);
        const TabIcon = active ? IconActive : Icon;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center gap-1 py-3 ${
              active ? 'text-secondary-900' : 'text-secondary-500'
            }`}
          >
            <TabIcon className="size-6" />
            {/* 계측(HOME-001): 라벨 12(body3), 경계선→아이콘 12, 아이콘→라벨 4.
                활성 탭만 medium — 디자인에서 '홈'이 나머지보다 확실히 굵다. */}
            <span className={`text-body3 ${active ? 'font-medium' : ''}`}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
