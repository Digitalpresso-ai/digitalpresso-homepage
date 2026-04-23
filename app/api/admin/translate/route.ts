// app/api/admin/translate/route.ts

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { translateWithDeepl } from '@/lib/deepl';

const translateRequestSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = translateRequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid translate payload.' },
        { status: 400 },
      );
    }

    const { title, content } = parsed.data;

    const [titleEn, titleJa, contentEn, contentJa] = await Promise.all([
      translateWithDeepl(title, 'EN-US'),
      translateWithDeepl(title, 'JA'),
      translateWithDeepl(content, 'EN-US'),
      translateWithDeepl(content, 'JA'),
    ]);

    return NextResponse.json(
      { titleEn, titleJa, contentEn, contentJa },
      { status: 200 },
    );
  } catch (error) {
    console.error('[admin/translate][POST] Failed to translate', error);

    return NextResponse.json(
      { message: 'Failed to translate article.' },
      { status: 502 },
    );
  }
}
