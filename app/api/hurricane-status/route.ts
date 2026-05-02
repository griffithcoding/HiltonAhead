import { NextResponse } from 'next/server';
import { getHurricaneStatus } from '@/app/lib/hurricane';

export const revalidate = 1800;

export async function GET() {
  const payload = await getHurricaneStatus();
  return NextResponse.json(payload);
}
