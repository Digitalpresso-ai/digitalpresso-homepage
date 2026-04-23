// lib/deepl.ts

const DEEPL_FREE_ENDPOINT = 'https://api-free.deepl.com/v2/translate';
const DEEPL_PRO_ENDPOINT = 'https://api.deepl.com/v2/translate';

export type DeeplTargetLang = 'EN-US' | 'JA';

type DeeplResponse = {
  translations: Array<{
    detected_source_language: string;
    text: string;
  }>;
};

function getEndpoint(apiKey: string): string {
  return apiKey.endsWith(':fx') ? DEEPL_FREE_ENDPOINT : DEEPL_PRO_ENDPOINT;
}

export async function translateWithDeepl(
  text: string,
  targetLang: DeeplTargetLang,
): Promise<string> {
  const apiKey = process.env.DEEPL_API_KEY;

  if (!apiKey) {
    throw new Error('DEEPL_API_KEY is not configured');
  }

  if (!text.trim()) {
    return '';
  }

  const response = await fetch(getEndpoint(apiKey), {
    method: 'POST',
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      text,
      source_lang: 'KO',
      target_lang: targetLang,
      tag_handling: 'html',
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`DeepL request failed (${response.status}): ${detail}`);
  }

  const data = (await response.json()) as DeeplResponse;
  return data.translations[0]?.text ?? '';
}
