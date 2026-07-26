import { api } from '@lib/api-client';

/** 약관 API. 근거: docs/api-reference.md §3 */

export type LegalDocumentType = 'service' | 'privacy';

export interface LegalDocument {
  /** 마크다운 본문 (`#`, `###`, `---`, 목록 등) */
  content: string;
  /** 오프셋 없는 서버 시각 */
  updatedAt: string;
}

/** 이용약관(`service`) / 개인정보 처리방침(`privacy`). 둘 다 **공개 API**다. */
export function getLegalDocument(type: LegalDocumentType) {
  return api.get<LegalDocument>(`/terms/${type}`, { auth: false });
}
