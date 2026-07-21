import { Header } from '@components/layout/header';
import { Avatar } from '@components/ui/avatar';
import { CameraIcon } from '@components/icons';
import { mockUser } from '@/mocks/my';

// MY-002 프로필 편집 — 기본(조회) 화면. 편집/저장 UI는 추후 별도.
export default function ProfileEditPage() {
  return (
    <>
      <Header title="프로필 편집" />

      <div className="flex flex-col items-center pt-6">
        <div className="relative">
          <Avatar className="size-24" />
          {/* 카메라 버튼 (시각만 — 이미지 변경은 추후) */}
          <span className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full border-2 border-background bg-secondary-900 text-white">
            <CameraIcon className="size-4" />
          </span>
        </div>
      </div>

      <div className="px-4 pt-8">
        <label className="text-body3 text-secondary-500">닉네임</label>
        <div className="mt-2 rounded-xl bg-secondary-10 px-4 py-3.5 text-body1 text-secondary-900">
          {mockUser.nickname}
        </div>
      </div>
    </>
  );
}
