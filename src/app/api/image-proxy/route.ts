import { NextResponse } from 'next/server';

/**
 * 포토카드 이미지를 **같은 출처(same-origin)** 로 중계한다.
 *
 * EX-010 이미지 저장은 여러 포카를 캔버스로 합성하는데, S3 이미지는 CORS 헤더가 없어
 * 브라우저에서 직접 읽으면 캔버스가 오염(tainted)되어 저장이 실패한다.
 * 이 경로를 거치면 same-origin이 되어 제약 없이 읽을 수 있다.
 *
 * ⚠️ 오픈 프록시가 되지 않도록 **허용 호스트를 고정**한다.
 */
const ALLOWED_HOST_SUFFIX = '.amazonaws.com';

export async function GET(request: Request) {
  const target = new URL(request.url).searchParams.get('url');
  if (!target) {
    return NextResponse.json({ message: 'url is required' }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return NextResponse.json({ message: 'invalid url' }, { status: 400 });
  }

  if (parsed.protocol !== 'https:' || !parsed.hostname.endsWith(ALLOWED_HOST_SUFFIX)) {
    return NextResponse.json({ message: 'host not allowed' }, { status: 403 });
  }

  const upstream = await fetch(parsed.toString(), { cache: 'force-cache' });
  if (!upstream.ok) {
    return NextResponse.json({ message: 'upstream error' }, { status: upstream.status });
  }

  return new NextResponse(upstream.body, {
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') ?? 'image/png',
      'Cache-Control': 'public, max-age=86400, immutable',
    },
  });
}
