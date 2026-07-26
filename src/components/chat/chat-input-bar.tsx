'use client';

import { useRef, useState } from 'react';
import { CloseIcon, PlusIcon, SendIcon } from '@components/icons';
import { ActionSheet } from '@components/common/action-sheet';
import { CHAT_IMAGE_ACCEPT } from '@lib/api/chat';

/**
 * CHAT-002 메시지 입력창.
 * 입력이 있어야 보내기 버튼이 활성화된다(스토리보드).
 *
 * 전송은 WebSocket(STOMP)이라 **연결된 상태에서만** 가능하다 — 연결 전에는 버튼이 비활성이다.
 */
export function ChatInputBar({
  onSend,
  onPickImage,
  disabled = false,
}: {
  onSend?: (text: string) => boolean;
  /** ＋ → '사진 보내기'로 고른 파일 */
  onPickImage?: (file: File) => void;
  disabled?: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const canSend = text.trim().length > 0 && !disabled;

  const send = () => {
    if (!canSend) return;
    // 전송에 실패하면(연결 끊김 등) 입력을 지우지 않는다 — 사용자가 다시 시도할 수 있게.
    if (onSend?.(text) !== false) setText('');
  };

  return (
    <div className="sticky bottom-0 flex items-center gap-2 bg-background px-4 pb-[env(safe-area-inset-bottom)] pt-2">
      <button
        type="button"
        aria-label="사진 첨부"
        // 전송이 소켓을 타므로, 연결 전에는 텍스트와 마찬가지로 막는다.
        disabled={disabled}
        onClick={() => setSheetOpen(true)}
        className={`shrink-0 ${disabled ? 'text-secondary-300' : 'text-secondary-900'}`}
      >
        <PlusIcon className="size-6" />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept={CHAT_IMAGE_ACCEPT}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          // 같은 파일을 다시 골라도 change가 발생하도록 값을 비운다.
          event.target.value = '';
          if (file) onPickImage?.(file);
        }}
      />

      <ActionSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        actions={[
          {
            label: '사진 보내기',
            onClick: () => {
              setSheetOpen(false);
              fileInputRef.current?.click();
            },
          },
        ]}
      />

      <div className="relative min-w-0 flex-1">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.nativeEvent.isComposing) send();
          }}
          placeholder="메시지 입력하기"
          aria-label="메시지 입력"
          className="h-10 w-full rounded-full bg-secondary-10 pl-4 pr-9 text-body2 text-secondary-900 outline-none placeholder:text-secondary-300"
        />
        {canSend && (
          <button
            type="button"
            aria-label="입력 지우기"
            onClick={() => setText('')}
            className="absolute right-3 top-1/2 flex size-4 -translate-y-1/2 items-center justify-center rounded-full bg-gray-300 text-white"
          >
            <CloseIcon className="size-2.5" />
          </button>
        )}
      </div>

      <button
        type="button"
        aria-label="보내기"
        disabled={!canSend}
        onClick={send}
        className={`shrink-0 ${canSend ? 'text-secondary-900' : 'text-secondary-300'}`}
      >
        <SendIcon className="size-6" />
      </button>
    </div>
  );
}
