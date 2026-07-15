'use client';

import { useState } from 'react';
import { PlusIcon, SendIcon } from '@components/icons';

/**
 * CHAT-002 메시지 입력창.
 * 입력이 있어야 보내기 버튼이 활성화된다(스토리보드).
 */
export function ChatInputBar() {
  const [text, setText] = useState('');
  const canSend = text.trim().length > 0;

  return (
    <div className="sticky bottom-0 flex items-center gap-2 bg-background px-4 pb-[env(safe-area-inset-bottom)] pt-2">
      <button
        type="button"
        aria-label="사진 첨부"
        // TODO: 플러스 버튼 → 기기 갤러리/카메라 연결 (스토리보드 CHAT-002)
        className="shrink-0 text-secondary-900"
      >
        <PlusIcon className="size-6" />
      </button>

      <input
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="메세지 입력하기"
        aria-label="메시지 입력"
        className="h-10 min-w-0 flex-1 rounded-full bg-secondary-10 px-4 text-body2 text-secondary-900 outline-none placeholder:text-secondary-300"
      />

      <button
        type="button"
        aria-label="보내기"
        disabled={!canSend}
        // TODO: 메시지 전송 API 연동. 첫 메시지 전송 시 채팅방 생성(스토리보드)
        onClick={() => setText('')}
        className={`shrink-0 ${canSend ? 'text-secondary-900' : 'text-secondary-300'}`}
      >
        <SendIcon className="size-6" />
      </button>
    </div>
  );
}
