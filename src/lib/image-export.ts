import type { Photocard } from '@/types/photocard.types';

/**
 * 내보내기용 이미지 준비.
 *
 * 캡처 라이브러리에 이미지 로딩을 맡기지 않고 **미리 data URL로 바꿔서** 넘긴다.
 * 그래야 카드마다 자기 이미지가 확실히 들어가고, 캔버스 오염(CORS) 문제도 생기지 않는다.
 */

/** S3 원본을 same-origin 프록시 경로로 바꾼다. */
function toProxyUrl(url: string): string {
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}

async function fetchAsDataUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(toProxyUrl(url));
    if (!response.ok) return null;
    const blob = await response.blob();

    return await new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(typeof reader.result === 'string' ? reader.result : null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

/**
 * 카드 목록의 `imageUrl`을 data URL로 교체한 사본을 돌려준다.
 * 실패한 이미지는 `null`로 두어 색상 placeholder로 렌더된다(전체 실패로 번지지 않게).
 *
 * 같은 URL이 여러 번 나와도 한 번만 받는다.
 */
export async function withInlinedImages(cards: Photocard[]): Promise<Photocard[]> {
  const uniqueUrls = [...new Set(cards.map((card) => card.imageUrl).filter(Boolean))] as string[];
  const entries = await Promise.all(
    uniqueUrls.map(async (url) => [url, await fetchAsDataUrl(url)] as const)
  );
  const dataUrlByOrigin = new Map(entries);

  return cards.map((card) => ({
    ...card,
    imageUrl: card.imageUrl ? (dataUrlByOrigin.get(card.imageUrl) ?? null) : null,
  }));
}

/**
 * SVG 엘리먼트를 미리 래스터화해 PNG data URL로 만든다.
 *
 * **왜 필요한가** — 캡처는 노드를 `<foreignObject>`에 넣어 SVG로 만든 뒤 이미지로 그리는데,
 * 그 안에 **또 SVG가 중첩되면** 브라우저에 따라 제대로 그려지지 않는다.
 * 같은 노드 안의 카드 사진은 `<img>` + data URL이라 문제없이 나오고 로고(인라인 SVG)만 깨졌다.
 * → 로고도 같은 방식으로 맞춘다.
 *
 * `scale`은 캡처 배율(2)보다 넉넉히 잡는다. 벡터라 키워도 파일이 거의 커지지 않는다.
 */
export async function rasterizeSvg(
  svg: SVGSVGElement,
  width: number,
  height: number,
  scale = 4
): Promise<string | null> {
  try {
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('width', String(width));
    clone.setAttribute('height', String(height));

    const markup = new XMLSerializer().serializeToString(clone);
    const source = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;

    const image = await new Promise<HTMLImageElement | null>((resolve) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => resolve(null);
      element.src = source;
    });
    if (!image) return null;

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const context = canvas.getContext('2d');
    if (!context) return null;

    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
  } catch {
    return null;
  }
}

/* ────────────────────────────────────────────────────────────────
   폰트 임베드
   ──────────────────────────────────────────────────────────────── */

/** 내보내기 노드에서 쓰는 글꼴. 이 둘만 골라 심는다. */
const EXPORT_FONT_FAMILIES = ['Pretendard Variable', 'Plus Jakarta Sans'];

/** `U+ac00`, `U+0-ff`, `U+f9??` 형태를 [시작, 끝] 코드포인트로 바꾼다. */
function parseUnicodeRange(range: string): [number, number][] {
  return range
    .split(',')
    .map((part) => part.trim().replace(/^u\+/i, ''))
    .flatMap((part) => {
      if (part.includes('-')) {
        const [from, to] = part.split('-');
        return [[parseInt(from, 16), parseInt(to, 16)] as [number, number]];
      }
      if (part.includes('?')) {
        // 와일드카드: `f9??` → f900 ~ f9ff
        return [
          [parseInt(part.replace(/\?/g, '0'), 16), parseInt(part.replace(/\?/g, 'f'), 16)] as [
            number,
            number,
          ],
        ];
      }
      const code = parseInt(part, 16);
      return [[code, code] as [number, number]];
    })
    .filter(([from, to]) => Number.isFinite(from) && Number.isFinite(to));
}

function familyMatches(value: string): boolean {
  const family = value.replace(/["']/g, '').trim();
  return EXPORT_FONT_FAMILIES.includes(family);
}

/** 문서에 로드된 스타일시트에서 @font-face 규칙만 모은다(크로스 오리진 시트는 접근이 막혀 건너뛴다). */
function collectFontFaceRules(): CSSFontFaceRule[] {
  const rules: CSSFontFaceRule[] = [];

  for (const sheet of Array.from(document.styleSheets)) {
    let sheetRules: CSSRuleList;
    try {
      sheetRules = sheet.cssRules;
    } catch {
      continue;
    }
    for (const rule of Array.from(sheetRules)) {
      if (rule instanceof CSSFontFaceRule) rules.push(rule);
    }
  }

  return rules;
}

async function toDataUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const blob = await response.blob();
    return await new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(typeof reader.result === 'string' ? reader.result : null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

/**
 * 캡처 노드에 실제로 쓰인 글자만 커버하는 `@font-face` CSS를 만든다.
 *
 * **왜 직접 만드나** — `html-to-image`는 옵션을 안 주면 문서의 @font-face를 **전부** 받아 인라인한다.
 * 우리는 Pretendard를 **동적 서브셋(92개 파일)** 으로 쓰고 있어서 그 전부를 받으려다
 * 캡처가 느려지고 폰트가 누락돼, 저장된 이미지가 시스템 기본 폰트로 나왔다.
 *
 * 실제로 쓰는 글자는 카드 이름 몇 개뿐이라 **서브셋 서너 개면 충분**하다.
 * `unicode-range`가 글자와 겹치는 규칙만 골라 그 파일만 data URL로 심는다.
 *
 * 실패하면 `null`을 돌려준다 — 호출부는 옵션을 빼고 라이브러리 기본 동작에 맡긴다.
 */
export async function buildFontEmbedCss(text: string): Promise<string | null> {
  try {
    const codePoints = [...new Set([...text].map((char) => char.codePointAt(0) ?? 0))];

    const needed = collectFontFaceRules().filter((rule) => {
      if (!familyMatches(rule.style.getPropertyValue('font-family'))) return false;

      const range = rule.style.getPropertyValue('unicode-range');
      if (!range) return true; // 범위가 없으면 모든 글자를 담당한다

      const ranges = parseUnicodeRange(range);
      return codePoints.some((code) => ranges.some(([from, to]) => code >= from && code <= to));
    });

    const blocks = await Promise.all(
      needed.map(async (rule) => {
        const src = rule.style.getPropertyValue('src');
        const url = /url\(["']?([^"')]+)["']?\)/.exec(src)?.[1];
        if (!url) return null;

        const dataUrl = await toDataUrl(url);
        if (!dataUrl) return null;

        const descriptor = (name: string) => {
          const value = rule.style.getPropertyValue(name);
          return value ? `${name}:${value};` : '';
        };

        return (
          `@font-face{` +
          `font-family:${rule.style.getPropertyValue('font-family')};` +
          descriptor('font-style') +
          descriptor('font-weight') +
          `src:url(${dataUrl}) format('woff2');` +
          descriptor('unicode-range') +
          `}`
        );
      })
    );

    const css = blocks.filter(Boolean).join('');
    return css.length > 0 ? css : null;
  } catch {
    return null;
  }
}
