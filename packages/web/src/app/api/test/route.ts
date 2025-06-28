import { NextResponse } from 'next/server';
import { getActiveWaterSystems, getViolationStats } from '@/db/queries';

export async function GET() {
  try {
    // Test queries
    const activeSystemsPromise = getActiveWaterSystems();
    const violationStatsPromise = getViolationStats();

    const [activeSystems, violationStats] = await Promise.all([
      activeSystemsPromise,
      violationStatsPromise,
    ]);

    return NextResponse.json({
      success: true,
      data: {
        activeSystemsCount: activeSystems.length,
        sampleSystems: activeSystems.slice(0, 5).map((system) => ({
          pwsid: system.pwsid,
          name: system.pwsName,
          population: system.populationServedCount,
        })),
        violationStats,
      },
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
