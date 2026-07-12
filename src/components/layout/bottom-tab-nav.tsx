'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@constants/routes';
import { ChatIcon, CollectionIcon, ExchangeIcon, HomeIcon, UserIcon } from '@components/icons';

const TABS = [
  { href: ROUTES.home, label: '홈', Icon: HomeIcon },
  { href: ROUTES.collection, label: '컬렉션', Icon: CollectionIcon },
  { href: ROUTES.exchange, label: '내교환', Icon: ExchangeIcon },
  { href: ROUTES.chat, label: '채팅', Icon: ChatIcon },
  { href: ROUTES.my, label: '마이', Icon: UserIcon },
] as const;

export function BottomTabNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-10 flex border-t border-secondary-50 bg-background pb-[env(safe-area-inset-bottom)]">
      {TABS.map(({ href, label, Icon }) => {
        const active = href === ROUTES.home ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center gap-1 py-2 ${
              active ? 'text-secondary-900' : 'text-secondary-300'
            }`}
          >
            <Icon className="size-6" />
            <span className={`text-[10px] leading-none ${active ? 'font-medium' : ''}`}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
