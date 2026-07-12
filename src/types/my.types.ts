export interface UserProfile {
  nickname: string;
  avatarUrl: string | null;
}

export interface InterestGroup {
  id: string;
  name: string;
  color: string; // placeholder 원형 배경색 (로고 에셋 제공 전)
  logoUrl: string | null;
}
