#!/usr/bin/env node

/**
 * Database cleanup script for Railway deployment
 * Can be run via cron or Railway's scheduled jobs
 */

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'demo-cleanup-key';
const API_URL = process.env.RAILWAY_PUBLIC_DOMAIN
  ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
  : process.env.VERCEL_URL || 'http://localhost:3000';

// For Railway cron: check if API_URL is properly configured
if (!API_URL.startsWith('http')) {
  console.error(
    'API_URL not properly configured. RAILWAY_PUBLIC_DOMAIN environment variable not found.'
  );
  process.exit(1);
}

console.log(`API URL: ${API_URL}`);
console.log(`Using admin secret: ${ADMIN_SECRET ? 'SET' : 'NOT SET'}`);
console.log(`Starting cleanup at: ${new Date().toISOString()}`);

async function runCleanup() {
  try {
    console.log('Starting automated cleanup...');

    const response = await fetch(`${API_URL}/api/admin/cleanup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ secret: ADMIN_SECRET }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    console.log('Cleanup completed successfully:');
    console.log(`   - Old todos deleted: ${result.results.oldTodosDeleted}`);
    console.log(
      `   - Excess todos deleted: ${result.results.excessTodosDeleted}`
    );
    console.log(
      `   - Inappropriate todos deleted: ${result.results.inappropriateDeleted}`
    );
  } catch (error) {
    console.error('Cleanup failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
runCleanup();
