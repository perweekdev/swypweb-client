'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Header } from '@components/layout/header';
import { Avatar } from '@components/ui/avatar';
import { Button } from '@components/ui/button';
import { TextField } from '@components/ui/text-field';
import { CameraIcon } from '@components/icons';
import { useMyProfile } from '@hooks/use-my-profile';
import { isApiError } from '@lib/api-error';
import {
  PROFILE_IMAGE_ACCEPT,
  updateNickname,
  updateProfileImage,
  validateProfileImage,
} from '@lib/api/users';
import { validateNickname } from '@lib/api/auth';
import { queryKeys } from '@lib/query-keys';
import { useAuthStore } from '@store/auth-store';

/**
 * MY-002 프로필 편집.
 * 저장 액션은 **헤더 우측 '완료'** 다(디자인). 닉네임이 비어 있으면 비활성.
 *
 * 이미지는 선택 시 로컬 미리보기만 잡아두고, '완료'를 눌러야 서버에 반영한다.
 * (이미지·닉네임 API가 분리돼 있어 순차 호출한다 — 이미지 먼저, 닉네임 나중)
 */
export function ProfileEditForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: profile } = useMyProfile();
  const storedNickname = useAuthStore((s) => s.nickname);

  const fileInputRef = useRef<HTMLInputElement>(null);
  // 사용자가 입력하기 전에는 null. 그래야 서버 값이 늦게 도착해도 입력을 덮어쓰지 않는다.
  // (effect로 초기값을 넣으면 불필요한 연쇄 렌더가 생긴다)
  const [draft, setDraft] = useState<string | null>(null);
  const [pickedImage, setPickedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const savedNickname = profile?.nickname ?? storedNickname ?? '';
  const nickname = draft ?? savedNickname;

  // 미리보기 blob URL 해제 (누수 방지)
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const pickImage = (file: File | undefined) => {
    if (!file) return;

    const invalidReason = validateProfileImage(file);
    if (invalidReason) {
      setError(invalidReason);
      return;
    }

    setError(null);
    setPickedImage(file);
    setPreviewUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return URL.createObjectURL(file);
    });
  };

  const nicknameChanged = nickname.trim() !== savedNickname;
  const canSave =
    nickname.trim().length > 0 && !saving && (nicknameChanged || pickedImage !== null);

  const save = async () => {
    if (!canSave) return;

    if (nicknameChanged) {
      const invalidReason = validateNickname(nickname);
      if (invalidReason) {
        setError(invalidReason);
        return;
      }
    }

    setSaving(true);
    setError(null);

    try {
      if (pickedImage) await updateProfileImage(pickedImage);
      if (nicknameChanged) {
        const saved = await updateNickname(nickname.trim());
        useAuthStore.getState().setNickname(saved.nickname);
      }

      await queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      router.back();
    } catch (caught) {
      setSaving(false);

      if (!isApiError(caught)) {
        setError('잠시 후 다시 시도해주세요.');
        return;
      }
      if (caught.isNicknameDuplicated) {
        setError('이미 사용 중인 닉네임이에요.');
        return;
      }
      // 5MB 초과는 413으로 온다(일반 400과 다름).
      if (caught.status === 413) {
        setError('이미지 용량은 5MB 이하만 가능해요.');
        return;
      }
      setError(caught.message);
    }
  };

  return (
    <>
      <Header
        title="프로필 편집"
        right={
          <Button variant="navy" size="sm" shape="pill" disabled={!canSave} onClick={save}>
            {saving ? '저장 중' : '완료'}
          </Button>
        }
      />

      <div className="flex flex-col items-center pt-6">
        <div className="relative">
          <Avatar
            className="size-24"
            src={previewUrl ?? profile?.profileImageUrl}
            alt="프로필 사진"
          />
          <button
            type="button"
            aria-label="프로필 사진 변경"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full border-2 border-background bg-secondary-900 text-white"
          >
            <CameraIcon className="size-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept={PROFILE_IMAGE_ACCEPT}
            className="hidden"
            onChange={(e) => {
              pickImage(e.target.files?.[0]);
              // 같은 파일을 다시 골라도 change가 발생하도록 값을 비운다.
              e.target.value = '';
            }}
          />
        </div>
      </div>

      <div className="px-4 pt-8">
        <label htmlFor="nickname" className="text-body3 text-secondary-500">
          닉네임
        </label>
        <TextField
          id="nickname"
          className="mt-2"
          value={nickname}
          onValueChange={(value) => {
            setDraft(value);
            if (error) setError(null);
          }}
          placeholder="닉네임을 입력하세요."
        />
        {error && <p className="mt-2 px-1 text-body3 text-red-900">{error}</p>}
      </div>
    </>
  );
}
