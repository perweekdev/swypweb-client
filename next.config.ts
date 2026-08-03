import type { NextConfig } from 'next';

/** 31일. Vercel Hobby 플랜에서 허용하는 이미지 캐시 상한이다. */
const THIRTY_ONE_DAYS_IN_SECONDS = 60 * 60 * 24 * 31;

const nextConfig: NextConfig = {
  images: {
    // 프로필 이미지 저장소(S3). 버킷명이 호스트 앞단에 붙는다:
    // phocamatch-images-<account>-<region>-an.s3.ap-northeast-2.amazonaws.com
    remotePatterns: [{ protocol: 'https', hostname: '*.s3.ap-northeast-2.amazonaws.com' }],

    /**
     * 이미지 최적화 변환 횟수를 줄이려고 캐시를 길게 잡는다.
     *
     * 기본값은 4시간(14400)이라 같은 이미지가 하루에도 여러 번 다시 변환된다.
     * Vercel Hobby는 변환 5,000회/주기가 한도인데 2026-08-03에 소진됐다.
     *
     * 길게 잡아도 안전한 이유 — **URL이 재사용되지 않는다.**
     *   프로필: `profile-images/{userId}/{uuid}.jpg` — 업로드마다 uuid가 새로 붙는다
     *   포카  : `포토카드 이미지/{그룹}/{앨범}/{버전}/….png` — 바뀌지 않는 카탈로그 자산
     *
     * ⚠️ 반대로 **같은 S3 키의 내용을 갈아끼우면** 최대 31일간 옛 이미지가 나온다.
     *   포카 이미지를 교체할 일이 생기면 키를 새로 만들어야 한다.
     */
    minimumCacheTTL: THIRTY_ONE_DAYS_IN_SECONDS,

    /**
     * ⚠️ **한도 소진으로 이미지 최적화를 끈 상태다.**
     *
     * 2026-08-04 배포에서 `/_next/image`가 **402**를 반환해 포카·프로필·그룹 로고가
     * 전부 깨지고 `alt` 텍스트만 보였다(변환 5,000회 한도 소진).
     * 끄면 S3 원본을 그대로 내려받는다 — 원본이 공개(200)라 바로 복구된다.
     *
     * 대가: 포카 1장이 **약 1MB PNG**라 목록 화면에서 전송량이 크게 늘어난다.
     * 임시 조치이며, **BE가 업로드 리사이즈(요청 2-6: 긴 변 1024 + WebP)를 적용하면**
     * 원본이 가벼워져 이대로 둬도 되고, 다음 주기에 최적화를 다시 켤 수도 있다.
     * (다시 켤 때는 위 `minimumCacheTTL`이 그대로 효과를 낸다)
     */
    unoptimized: true,
  },
};

export default nextConfig;
