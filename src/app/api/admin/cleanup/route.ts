import { NextResponse, NextRequest } from 'next/server';
import { DatabaseCleanup } from '@/lib/cleanup';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'demo-cleanup-key';

export async function POST(request: NextRequest) {
  console.log('Cleanup endpoint called at:', new Date().toISOString());

  try {
    console.log('Parsing request body...');
    let secret = '';
    try {
      // Read as text first, then parse as JSON
      const bodyText = await request.text();
      console.log('Body text received:', bodyText);

      if (bodyText) {
        const body = JSON.parse(bodyText);
        secret = typeof body.secret === 'string' ? body.secret : '';
        console.log('Secret provided:', secret, typeof secret);
      }
    } catch (e) {
      console.log('Failed to parse request body:', e);
      secret = '';
    }

    if (secret !== ADMIN_SECRET) {
      console.log('Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Authorization successful, starting cleanup...');
    console.log('DB_URL set:', !!process.env.DB_URL);
    console.log('DB_URL length:', process.env.DB_URL?.length || 0);

    const results = await DatabaseCleanup.runFullCleanup();
    console.log('Cleanup completed successfully:', results);

    return NextResponse.json({
      message: 'Cleanup completed successfully',
      results,
    });
  } catch (error) {
    console.error('Cleanup error occurred:', error);
    console.error(
      'Error name:',
      error instanceof Error ? error.name : 'Unknown'
    );
    console.error(
      'Error message:',
      error instanceof Error ? error.message : 'Unknown'
    );
    console.error(
      'Error stack:',
      error instanceof Error ? error.stack : 'No stack trace'
    );

    // Return more detailed error for debugging
    return NextResponse.json(
      {
        error: 'Cleanup failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        errorName: error instanceof Error ? error.name : 'Unknown',
        timestamp: new Date().toISOString(),
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
