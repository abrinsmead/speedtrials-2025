import { NextResponse } from 'next/server';
import { getViolationById, getEnforcementsByViolation } from '@/db/queries';

export async function GET(request: Request, { params }: { params: { pwsid: string; id: string } }) {
  try {
    const { pwsid, id } = params;
    console.log('Fetching violation:', { pwsid, id });

    const violation = await getViolationById(pwsid, id);
    console.log('Violation result:', violation);

    if (!violation) {
      return NextResponse.json({ error: 'Violation not found' }, { status: 404 });
    }

    const enforcements = await getEnforcementsByViolation(pwsid, id);
    console.log('Enforcements result:', enforcements);

    return NextResponse.json({
      violation,
      enforcements: enforcements || [],
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch violation details',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
