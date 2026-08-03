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
  },
};

export default nextConfig;
