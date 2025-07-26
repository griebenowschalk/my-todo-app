import { NextResponse } from 'next/server';
import { DatabaseCleanup } from '@/lib/cleanup';

export async function GET() {
  try {
    const stats = await DatabaseCleanup.runFullCleanup();

    return NextResponse.json({
      message: 'Cleanup stats retrieved',
      stats,
      lastRun: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 });
  }
}
