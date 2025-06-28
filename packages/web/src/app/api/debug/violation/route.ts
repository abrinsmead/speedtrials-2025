import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const pwsid = url.searchParams.get('pwsid');
    const id = url.searchParams.get('id');

    if (!pwsid || !id) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Direct SQL query to debug
    const result = await db.all(sql`
      SELECT * FROM SDWA_VIOLATIONS_ENFORCEMENT 
      WHERE PWSID = ${pwsid} 
      AND VIOLATION_ID = ${id}
      AND SUBMISSIONYEARQUARTER = '2025Q1'
      LIMIT 1
    `);

    return NextResponse.json({
      query: { pwsid, id },
      result: result,
      count: result.length,
    });
  } catch (error) {
    console.error('Debug Error:', error);
    return NextResponse.json(
      {
        error: 'Query failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
