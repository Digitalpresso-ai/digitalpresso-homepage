// lib/legal.ts
//
// 법무 확정 원문(content/legal/*.md)을 서버에서 HTML로 변환한다.
// 원문 글자는 그대로 두고, 표 감싸기와 URL·이메일 링크만 덧붙인다.

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { Marked } from 'marked';

export type LegalDocument = 'privacy' | 'terms';

export interface RenderedLegalDocument {
  /** 원문 첫 줄의 `# 제목` */
  title: string;
  /** 제목을 뺀 본문 HTML */
  html: string;
}

const LEGAL_DIR = path.join(process.cwd(), 'content', 'legal');

const marked = new Marked({
  gfm: true,
  tokenizer: {
    // GFM 자동 링크는 "https://digitalpresso.ai)와"처럼 뒤따르는 한글까지
    // 주소로 잡는다. 끄고 아래 linkify에서 직접 처리한다.
    url() {
      return undefined;
    },
  },
});

// ASCII 문자만 주소로 인정해 괄호·한글·문장부호 앞에서 끊는다.
const LINK_PATTERN =
  /(https?:\/\/[A-Za-z0-9\-._~/?#=&%:+]*[A-Za-z0-9\-_~/=&%+])|([A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,})|((?<![A-Za-z0-9.@/-])(?:www\.[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+|[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:go|or)\.kr))/g;

function linkifyText(text: string): string {
  return text.replace(LINK_PATTERN, (match, url?: string, email?: string) => {
    if (url) {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${match}</a>`;
    }
    if (email) {
      return `<a href="mailto:${email}">${match}</a>`;
    }
    return `<a href="https://${match}" target="_blank" rel="noopener noreferrer">${match}</a>`;
  });
}

/** 태그 바깥의 텍스트 노드에만 링크를 적용한다. */
function linkify(html: string): string {
  return html
    .split(/(<[^>]+>)/)
    .map((part) => (part.startsWith('<') ? part : linkifyText(part)))
    .join('');
}

/** 표를 가로 스크롤 영역으로 감싸고, 열 수를 data 속성으로 남긴다. */
function wrapTables(html: string): string {
  return html.replace(/<table>([\s\S]*?)<\/table>/g, (table, inner: string) => {
    const headerRow = inner.match(/<tr>([\s\S]*?)<\/tr>/)?.[1] ?? '';
    const columns = (headerRow.match(/<th[\s>]/g) ?? []).length;
    return `<div class="legal-table-scroll" role="region" aria-label="표" tabindex="0"><table data-columns="${columns}">${inner}</table></div>`;
  });
}

export async function renderLegalDocument(
  document: LegalDocument,
): Promise<RenderedLegalDocument> {
  const source = await readFile(path.join(LEGAL_DIR, `${document}.md`), 'utf8');

  const [firstLine, ...rest] = source.split('\n');
  const title = firstLine.replace(/^#\s+/, '').trim();
  const body = rest.join('\n');

  const html = wrapTables(linkify(await marked.parse(body)));

  return { title, html };
}
