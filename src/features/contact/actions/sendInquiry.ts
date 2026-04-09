// src/features/contact/actions/sendInquiry.ts

import type { ContactFormData } from '../types/contact.types';
import type { InquiryApiResponse, InquiryRequestPayload } from '../types/inquiry.types';

const INQUIRY_API_URL =
  process.env.RENAMEDP_INQUIRY_API_URL ?? 'https://api.renamedp.ai/v1/inquery';

export async function sendInquiry(data: ContactFormData): Promise<void> {
  const content = data.phone
    ? `${data.message}\n\n[phone] ${data.phone}`
    : data.message;

  const payload: InquiryRequestPayload = {
    email: data.email,
    name: data.name,
    content,
    from: data.source,
    organization: data.organization,
    consent: data.privacyConsent ? 'Y' : 'N',
    type: data.inquiryType,
  };

  const response = await fetch(INQUIRY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(`Inquiry API failed (${response.status}): ${responseText}`);
  }

  if (response.headers.get('content-type')?.includes('application/json')) {
    await response.json() as InquiryApiResponse;
  }
}
