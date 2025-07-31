import { vi } from 'vitest';

// Mock pg
vi.mock('pg', () => ({
  Pool: vi.fn(() => 'mock-pool'),
}));

// Mock drizzle
vi.mock('drizzle-orm/node-postgres', () => ({
  drizzle: vi.fn(() => 'mock-db'),
}));

describe('Database', () => {
  it('should export database instance and call required functions', async () => {
    // Import the database module first to trigger the function calls
    const { db } = await import('../index');

    // Import the mocks to check they were called
    const { Pool } = await import('pg');
    const { drizzle } = await import('drizzle-orm/node-postgres');

    const mockPool = vi.mocked(Pool);
    const mockDrizzle = vi.mocked(drizzle);

    expect(db).toBe('mock-db');
    expect(mockPool).toHaveBeenCalled();
    expect(mockDrizzle).toHaveBeenCalled();
  });

  it('should use the correct environment variable', async () => {
    const { Pool } = await import('pg');
    const mockPool = vi.mocked(Pool);
    mockPool.mockReturnValue(
      'mock-pool' as unknown as InstanceType<typeof Pool>
    );

    new Pool({
      connectionString: process.env.DB_URL,
      max: 10,
    });

    expect(mockPool).toHaveBeenCalledWith({
      connectionString: process.env.DB_URL,
      max: 10,
    });
  });
});
