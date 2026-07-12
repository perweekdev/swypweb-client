import type { InterestGroup, UserProfile } from '@/types/my.types';

// BE 연동 전 임시 목 데이터
export const mockUser: UserProfile = {
  nickname: '포카요정',
  avatarUrl: null,
};

export const mockInterestGroups: InterestGroup[] = [
  { id: 'red-velvet', name: 'Red Velvet', color: '#1F1F1F', logoUrl: null },
  { id: 'ive', name: 'IVE', color: '#E19AB8', logoUrl: null },
];
