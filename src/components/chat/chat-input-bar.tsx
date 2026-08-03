'use client';

import { useRef, useState } from 'react';
import { PlusIcon, SendIcon } from '@components/icons';
import { ActionSheet } from '@components/common/action-sheet';
import { ChatInputField } from '@components/ui/chat-input-field';
import { CHAT_IMAGE_ACCEPT } from '@lib/api/chat';

/**
 * CHAT-002 메시지 입력창.
 * 입력이 있어야 보내기 버튼이 활성화된다(스토리보드).
 *
 * 전송은 WebSocket(STOMP)이라 **연결된 상태에서만** 가능하다 — 연결 전에는 버튼이 비활성이다.
 *
 * 계측(2차 요청 1번): 바 높이 77 = 상단 8 + 입력 37 + **하단 32**.
 * 하단 여백이 없어 화면 끝에 붙어 있던 것을 띄웠다. ＋·보내기와 입력 사이 간격은 4다.
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
    <>
      <div className="sticky bottom-0 flex items-center gap-1 bg-background px-4 pb-[calc(32px_+_env(safe-area-inset-bottom))] pt-2">
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

        <div className="min-w-0 flex-1">
          <ChatInputField
            value={text}
            onValueChange={setText}
            onSubmit={send}
            placeholder="메시지 입력하기"
            aria-label="메시지 입력"
          />
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

      {/*
        시트는 입력창(sticky) **밖**에 둔다.
        `position: sticky`는 z-index와 무관하게 스택 컨텍스트를 만들어서, 그 안에 있으면
        시트의 z-50이 갇혀 상단 헤더(sticky top-0 z-10)를 덮지 못한다 — 딤이 위쪽만 비껴간다.
      */}
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
    </>
  );
}
