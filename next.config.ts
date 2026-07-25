import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // 프로필 이미지 저장소(S3). 버킷명이 호스트 앞단에 붙는다:
    // phocamatch-images-<account>-<region>-an.s3.ap-northeast-2.amazonaws.com
    remotePatterns: [{ protocol: 'https', hostname: '*.s3.ap-northeast-2.amazonaws.com' }],
  },
};

export default nextConfig;
