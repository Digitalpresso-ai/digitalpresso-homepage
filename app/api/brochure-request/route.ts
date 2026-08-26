// app/api/brochure-request/route.ts

import { NextResponse } from 'next/server';
import { brochureRequestSchema } from '@/src/features/home/types/brochure.types';
import { sendBrochureRequest } from '@/src/features/home/actions/sendBrochureRequest';

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = brochureRequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid brochure request payload.' },
        { status: 400 },
      );
    }

    await sendBrochureRequest(parsed.data);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('[brochure-request][POST] Failed to submit request', error);

    return NextResponse.json(
      { message: 'Failed to submit brochure request.' },
      { status: 502 },
    );
  }
}
