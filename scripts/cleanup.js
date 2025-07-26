#!/usr/bin/env node

/**
 * Database cleanup script for Railway deployment
 * Can be run via cron or Railway's scheduled jobs
 */

const API_URL = process.env.RAILWAY_PUBLIC_DOMAIN
  ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
  : process.env.VERCEL_URL || 'http://localhost:3000';

if (!API_URL.startsWith('http')) {
  console.error(
    'API_URL not properly configured. RAILWAY_PUBLIC_DOMAIN environment variable not found.'
  );
  process.exit(1);
}

async function runCleanup() {
  try {
    console.log('Starting automated cleanup...');

    const response = await fetch(`${API_URL}/api/admin/cleanup`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    console.log('Cleanup completed successfully:');
    console.log(`   - Old todos deleted: ${result.stats.oldTodosDeleted}`);
    console.log(
      `   - Excess todos deleted: ${result.stats.excessTodosDeleted}`
    );
    console.log(
      `   - Inappropriate todos deleted: ${result.stats.inappropriateDeleted}`
    );
  } catch (error) {
    console.error('Cleanup failed:', error.message);
    process.exit(1);
  }
}

runCleanup();
