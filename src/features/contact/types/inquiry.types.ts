// src/features/contact/types/inquiry.types.ts

export interface InquiryRequestPayload {
  email: string;
  name: string;
  content: string;
  from: string;
  organization: string;
  consent: string;
  type: string;
  phoneNumber: string;
}

export interface InquiryApiResponse {
  message?: string;
}
