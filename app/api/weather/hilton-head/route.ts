import { NextResponse } from 'next/server';
import { getHiltonHeadWeather } from '@/app/lib/weather';

export const revalidate = 1800;

export async function GET() {
  const payload = await getHiltonHeadWeather();
  return NextResponse.json(payload);
}
