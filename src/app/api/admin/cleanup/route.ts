import { NextResponse } from 'next/server';
import { DatabaseCleanup } from '@/lib/cleanup';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'demo-cleanup-key';

export async function POST(request: Request) {
  try {
    const { secret } = await request.json();

    if (secret !== ADMIN_SECRET) {
      console.log('Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const results = await DatabaseCleanup.runFullCleanup();

    return NextResponse.json({
      message: 'Cleanup completed successfully',
      results,
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    console.error(
      'Error stack:',
      error instanceof Error ? error.stack : 'No stack trace'
    );
    return NextResponse.json(
      {
        error: 'Cleanup failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

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
