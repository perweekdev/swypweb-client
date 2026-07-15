import type { ChatRoom } from '@/types/chat.types';
import { toChatRoomSummary } from '@/types/chat.types';
import type { ExchangeSet, Photocard } from '@/types/photocard.types';

/**
 * CHAT 도메인 목 데이터 (BE 연동 전 임시). 화면은 docs/designed/chat/ 기준.
 *
 * 상대 시간("방금 전", "5달 전")이 시간이 지나도 디자인과 같게 보이도록
 * 고정된 기준 시각을 둔다. BE 연동 시 MOCK_NOW를 지우고 Date.now()를 쓰면 된다.
 */
export const MOCK_NOW = '2026-07-04T09:05:00+09:00';

const MOCK_NOW_MS = Date.parse(MOCK_NOW);
const before = (minutes: number) => new Date(MOCK_NOW_MS - minutes * 60_000).toISOString();

const MINUTE = 1;
const HOUR = 60;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;

const card = (
  id: string,
  memberName: string,
  albumName: string,
  versionName: string,
  color: string
): Photocard => ({ id, memberName, albumName, versionName, imageUrl: null, color });

/** 있어요 1장 / 구해요 2장 — CHAT-002·003·004 디자인과 같은 구성 */
const ireneForSeulgi: ExchangeSet = {
  myCards: [card('pc-1', '아이린 A', 'Cosmic', 'Photobook ver.', '#D8C3E8')],
  partnerCards: [
    card('pc-2', '슬기', 'Cosmic', 'Digipack ver.', '#B7D3C2'),
    card('pc-3', '슬기', 'Cosmic', 'Photobook ver.', '#8FA98C'),
  ],
};

const simpleSet = (myColor: string, partnerColor: string): ExchangeSet => ({
  myCards: [card('pc-my', '멤버명', '앨범명', '버전명', myColor)],
  partnerCards: [card('pc-partner', '멤버명', '앨범명', '버전명', partnerColor)],
});

export const mockChatRooms: ChatRoom[] = [
  {
    id: '1',
    partner: { nickname: '포카매치', avatarUrl: null, color: '#CDD0D8' },
    unreadCount: 1,
    status: 'ongoing',
    exchangeSet: ireneForSeulgi,
    fromFeed: false,
    messages: [
      { id: 'm1', sender: 'partner', text: '안녕하세요😊', sentAt: before(3) },
      {
        id: 'm2',
        sender: 'partner',
        text: 'Cosmic 아이린이랑 제 슬기 포카랑 교환 할 수 있을까요?',
        sentAt: before(3),
      },
      {
        id: 'm3',
        sender: 'me',
        text: '아이린A 말씀하시는 건가요? 네 가능합니다.',
        sentAt: before(3),
      },
      { id: 'm4', sender: 'me', text: '포카 상태 확인 가능한가요?', sentAt: before(3) },
      { id: 'm5', sender: 'partner', text: '사진 보내드릴게요.', sentAt: before(3) },
      {
        id: 'm6',
        sender: 'partner',
        text: '뒤에 찍힘 자국 있긴 한데 잘 안보여요.',
        sentAt: before(3),
      },
      {
        id: 'm7',
        sender: 'partner',
        text: '방금 반탁 접수했어요! 코드 보내드릴게요.',
        sentAt: before(0),
      },
    ],
  },
  {
    id: '2',
    partner: { nickname: '포카매치', avatarUrl: null, color: '#E8B4A0' },
    unreadCount: 0,
    status: 'ongoing',
    exchangeSet: simpleSet('#C9A9E0', '#7FA8D8'),
    fromFeed: false,
    messages: [
      {
        id: 'm1',
        sender: 'partner',
        text: '잠시만요!\n사진 보내드릴게요.',
        sentAt: before(3 * MINUTE),
      },
    ],
  },
  {
    id: '3',
    partner: { nickname: '포카요정', avatarUrl: null, color: '#B5714F' },
    unreadCount: 1,
    status: 'completed',
    exchangeSet: simpleSet('#F0B27A', '#6FC7E8'),
    fromFeed: false,
    messages: [
      { id: 'm1', sender: 'partner', text: '교환 감사합니다ㅎㅎ', sentAt: before(4 * HOUR) },
    ],
  },
  {
    id: '4',
    partner: { nickname: '아쉬운 포카매치', avatarUrl: null, color: '#E6E8EB' },
    unreadCount: 0,
    status: 'ongoing',
    exchangeSet: simpleSet('#9BA1B0', '#CBB0F8'),
    // 홈 피드(HOME-004) 제안으로 시작 → 교환 완료 시 삭제 팝업 미표시 (memo 예외 1)
    fromFeed: true,
    messages: [
      {
        id: 'm1',
        sender: 'partner',
        text: '아쉽지만 교환은 어려울 것 같습니다ㅜㅜ',
        sentAt: before(3 * DAY),
      },
    ],
  },
  {
    id: '5',
    partner: { nickname: '포카매치', avatarUrl: null, color: '#8FD0C4' },
    unreadCount: 0,
    status: 'completed',
    exchangeSet: simpleSet('#B089F4', '#E19AB8'),
    fromFeed: false,
    messages: [
      {
        id: 'm1',
        sender: 'partner',
        text: '무사히 잘 받았습니다. 감사합니다~',
        sentAt: before(2 * WEEK),
      },
    ],
  },
  {
    id: '6',
    partner: { nickname: '포카매치', avatarUrl: null, color: '#C77B3F' },
    unreadCount: 0,
    status: 'ongoing',
    exchangeSet: simpleSet('#A0A6B4', '#F0B27A'),
    fromFeed: false,
    messages: [
      {
        id: 'm1',
        sender: 'partner',
        text: '슬기 포카는 뒷면에 찍힘 자국 약간 있고 아이린은 하자 없이 상태 좋아요.',
        sentAt: before(5 * MONTH),
      },
    ],
  },
];

/** CHAT-001 목록 — 최근 메시지 순 */
export const mockChatRoomSummaries = mockChatRooms.map(toChatRoomSummary);

export const findMockChatRoom = (id: string) => mockChatRooms.find((room) => room.id === id);
