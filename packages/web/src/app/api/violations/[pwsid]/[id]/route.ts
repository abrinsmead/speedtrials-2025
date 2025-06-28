import { NextResponse } from 'next/server';
import { getViolationById, getEnforcementsByViolation } from '@/db/queries';

export async function GET(request: Request, { params }: { params: { pwsid: string; id: string } }) {
  try {
    const { pwsid, id } = params;

    const violation = await getViolationById(pwsid, id);
    const enforcements = await getEnforcementsByViolation(pwsid, id);

    return NextResponse.json({
      violation,
      enforcements,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch violation details' }, { status: 500 });
  }
}
