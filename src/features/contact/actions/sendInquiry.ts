// src/features/contact/actions/sendInquiry.ts

import type { ContactFormData } from '../types/contact.types';
import type { InquiryApiResponse, InquiryRequestPayload } from '../types/inquiry.types';

const INQUIRY_API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/inquery`;

export async function sendInquiry(data: ContactFormData): Promise<void> {
  const payload: InquiryRequestPayload = {
    email: data.email,
    name: data.name,
    content: data.message,
    from: data.source,
    organization: data.organization,
    consent: data.privacyConsent ? 'Y' : 'N',
    type: data.inquiryType,
    phoneNumber: data.phone ?? '',
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
