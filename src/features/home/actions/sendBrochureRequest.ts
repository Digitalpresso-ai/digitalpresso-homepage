// src/features/home/actions/sendBrochureRequest.ts

import type { BrochureRequestData } from '../types/brochure.types';

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

export async function sendBrochureRequest(data: BrochureRequestData): Promise<void> {
  if (!SLACK_WEBHOOK_URL) {
    throw new Error('SLACK_WEBHOOK_URL is not configured.');
  }

  const response = await fetch(SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `📄 서비스 소개서 요청이 도착했습니다.\n• 이메일: ${data.email}\n• 개인정보 동의: ${data.privacyConsent ? '동의함' : '미동의'}`,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(`Slack webhook failed (${response.status}): ${responseText}`);
  }
}
