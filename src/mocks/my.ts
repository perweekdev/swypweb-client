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

// 관심 그룹 추가 화면에서 선택 가능한 전체 아티스트 목록 (placeholder 색상)
export const mockAllArtists: InterestGroup[] = [
  { id: 'ive', name: 'IVE', color: '#E19AB8', logoUrl: null },
  { id: 'aespa', name: 'aespa', color: '#B0B6C2', logoUrl: null },
  { id: 'illit', name: 'ILLIT', color: '#6FC7E8', logoUrl: null },
  { id: 'hearts2hearts', name: 'Hearts2Hearts', color: '#C9A9E0', logoUrl: null },
  { id: 'red-velvet', name: 'Red Velvet', color: '#1F1F1F', logoUrl: null },
  { id: 'nct-wish', name: 'NCT WISH', color: '#8FD0C4', logoUrl: null },
  { id: 'cortis', name: 'CORTIS', color: '#A0A6B4', logoUrl: null },
  { id: 'riize', name: 'RIIZE', color: '#7FA8D8', logoUrl: null },
  { id: 'tws', name: 'TWS', color: '#F0B27A', logoUrl: null },
  { id: 'stray-kids', name: 'Stray Kids', color: '#1F1F1F', logoUrl: null },
];
