import { NextResponse } from 'next/server';
import { getHiltonHeadTides } from '@/app/lib/tides';

export const revalidate = 3600;

export async function GET() {
  const payload = await getHiltonHeadTides();
  return NextResponse.json(payload);
}
