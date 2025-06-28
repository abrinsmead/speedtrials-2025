import { NextResponse } from 'next/server';
import { getAllSiteVisits } from '@/db/queries';

export async function GET() {
  try {
    const visits = await getAllSiteVisits();
    return NextResponse.json(visits);
  } catch (error) {
    console.error('Error fetching site visits:', error);
    return NextResponse.json({ error: 'Failed to fetch site visits' }, { status: 500 });
  }
}
