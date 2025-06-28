import { NextResponse } from 'next/server';
import { getAllViolations } from '@/db/queries';

export async function GET() {
  try {
    const violations = await getAllViolations();
    return NextResponse.json(violations);
  } catch (error) {
    console.error('Error fetching violations:', error);
    return NextResponse.json({ error: 'Failed to fetch violations' }, { status: 500 });
  }
}
