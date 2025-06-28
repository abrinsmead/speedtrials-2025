import { NextResponse } from 'next/server';
import { getAllWaterSystems } from '@/db/queries';

export async function GET() {
  try {
    const systems = await getAllWaterSystems();
    return NextResponse.json(systems);
  } catch (error) {
    console.error('Error fetching water systems:', error);
    return NextResponse.json({ error: 'Failed to fetch water systems' }, { status: 500 });
  }
}
