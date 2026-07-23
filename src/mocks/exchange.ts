import type { ExchangeSetSummary, MatchResult } from '@/types/exchange.types';
import { makeCards } from '@/mocks/photocard';

// BE 연동 전 임시 목 데이터 (EX-001·003·005·006·007·008)

/** 내가 등록한 교환 세트 — EX-001 '내 교환 세트 2', EX-003 목록 */
export const mockExchangeSets: ExchangeSetSummary[] = [
  {
    id: 'set-1',
    haveCards: makeCards('set-1-have', 3),
    wantCards: makeCards('set-1-want', 6),
  },
  {
    id: 'set-2',
    haveCards: makeCards('set-2-have', 3),
    wantCards: makeCards('set-2-want', 6),
  },
];

export const findMockExchangeSet = (id: string) => mockExchangeSets.find((set) => set.id === id);

/** 교환 가능한 상대 — EX-001 '교환 가능한 상대 5', EX-005 상세 */
export const mockMatchResults: MatchResult[] = [
  {
    id: 'match-1',
    partner: { id: 'u1', nickname: '포카요정', avatarColor: '#8FA98C', groups: 'Red Velvet · IVE' },
    haveCards: makeCards('match-1-have', 3),
    wantCards: makeCards('match-1-want', 6),
  },
  {
    id: 'match-2',
    partner: { id: 'u2', nickname: '포카컬렉터', avatarColor: '#B5C7D3', groups: 'aespa' },
    haveCards: makeCards('match-2-have', 3),
    wantCards: makeCards('match-2-want', 4),
  },
  {
    id: 'match-3',
    partner: { id: 'u3', nickname: '카드마스터', avatarColor: '#D9B8C4', groups: 'IVE' },
    haveCards: makeCards('match-3-have', 5),
    wantCards: makeCards('match-3-want', 2),
  },
  {
    id: 'match-4',
    partner: { id: 'u4', nickname: '앨범요정', avatarColor: '#A7A9BC', groups: 'Red Velvet' },
    haveCards: makeCards('match-4-have', 2),
    wantCards: makeCards('match-4-want', 5),
  },
  {
    id: 'match-5',
    partner: { id: 'u5', nickname: '포카사냥꾼', avatarColor: '#CBB89D', groups: 'ILLIT · TWS' },
    haveCards: makeCards('match-5-have', 4),
    wantCards: makeCards('match-5-want', 3),
  },
];

export const findMockMatchResult = (id: string) => mockMatchResults.find((m) => m.id === id);

// 교환 세트 등록(EX-007)에서 고르는 포카 소스는 컬렉션이 원본이다 → `@/mocks/collection` 참조.
