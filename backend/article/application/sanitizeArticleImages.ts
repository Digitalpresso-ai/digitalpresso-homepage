// 아티클 본문 HTML의 이미지 src를 검증한다.
//
// MCP/스킬로 올라온 글은 이미지 "바이너리"가 서버에 전송되지 않는다(텍스트만 전송).
// 그래서 마크다운 `![](article9-main.png)` 같은 참조는 `<img src="article9-main.png">`
// 처럼 실제로 접속 불가능한 상대경로로 남는다. 이 상태로 게시되면 실서버에서 이미지가
// 깨져(alt 텍스트만 노출) 보인다.
//
// 여기서는 "해결 가능한(resolvable) 이미지"만 통과시킨다. 그 외는 눈에 띄는 플레이스홀더로
// 치환해, admin 에디터에서 어느 위치에 어떤 이미지를 넣어야 하는지 알 수 있게 한다.

// http(s) 절대 URL, 프로토콜 상대(//...), data: URI, 그리고 /public 기준 절대경로(/...)는
// 렌더 시 실제로 접속 가능하므로 유효한 것으로 본다.
function isResolvableSrc(src: string): boolean {
  const s = src.trim();
  if (!s) return false;
  return (
    /^https?:\/\//i.test(s) ||
    s.startsWith('//') ||
    s.startsWith('data:') ||
    s.startsWith('/')
  );
}

function extractSrc(attrs: string): string | null {
  const match = attrs.match(/\ssrc\s*=\s*("([^"]*)"|'([^']*)')/i);
  if (!match) return null;
  return match[2] ?? match[3] ?? '';
}

export interface SanitizeArticleImagesResult {
  /** 미해결 이미지를 플레이스홀더로 치환한 HTML */
  html: string;
  /** 제거(치환)된 이미지의 원본 src 목록 */
  removed: string[];
}

/**
 * 본문 HTML에서 접속 불가능한 `<img>`를 찾아 플레이스홀더로 치환한다.
 * admin 에디터가 인식할 수 있도록 `data-missing-image` 속성과 원본 파일명을 남긴다.
 */
export function sanitizeArticleImages(html: string): SanitizeArticleImagesResult {
  const removed: string[] = [];

  const out = html.replace(/<img\b([^>]*)>/gi, (match, attrs: string) => {
    const src = extractSrc(attrs);
    // src가 없거나(빈 img) 접속 불가능한 경우 → 플레이스홀더
    if (src !== null && isResolvableSrc(src)) return match;

    const label = (src ?? '').trim() || '이미지';
    removed.push(label);
    const safeLabel = label
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

    return `<p data-missing-image="${safeLabel}"><em>[이미지 자리: ${safeLabel} — admin에서 직접 업로드하세요]</em></p>`;
  });

  return { html: out, removed };
}

/**
 * 본문 HTML에 아직 미해결(접속 불가능한) 이미지가 남아있는지 검사한다.
 * 게시 차단 검증에서 사용한다.
 */
export function hasUnresolvedImages(html: string): boolean {
  const matches = html.match(/<img\b[^>]*>/gi);
  if (!matches) return false;
  return matches.some((tag) => {
    const src = extractSrc(tag);
    return src === null || !isResolvableSrc(src);
  });
}
