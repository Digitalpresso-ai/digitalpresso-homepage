// app/api/contact/route.ts

import { NextResponse } from 'next/server';
import { contactFormSchema } from '@/src/features/contact/types/contact.types';
import { sendInquiry } from '@/src/features/contact/actions/sendInquiry';

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = contactFormSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid inquiry payload.' },
        { status: 400 },
      );
    }

    await sendInquiry(parsed.data);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('[contact][POST] Failed to submit inquiry', error);

    return NextResponse.json(
      { message: 'Failed to submit inquiry.' },
      { status: 502 },
    );
  }
}
