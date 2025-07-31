import { vi } from 'vitest';
import { GET } from '../route';

// Mock the cleanup function
vi.mock('@/lib/cleanup', () => ({
  DatabaseCleanup: {
    runFullCleanup: vi.fn(),
  },
}));

describe('/api/admin/cleanup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should get cleanup stats', async () => {
    const { runFullCleanup } = (await import('@/lib/cleanup')).DatabaseCleanup;
    vi.mocked(runFullCleanup).mockResolvedValue({
      oldTodosDeleted: 5,
      excessTodosDeleted: 2,
      inappropriateDeleted: 1,
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('message', 'Cleanup stats retrieved');
    expect(data).toHaveProperty('stats');
    expect(data.stats).toHaveProperty('oldTodosDeleted', 5);
    expect(data.stats).toHaveProperty('excessTodosDeleted', 2);
    expect(data.stats).toHaveProperty('inappropriateDeleted', 1);
    expect(data).toHaveProperty('lastRun');
    expect(runFullCleanup).toHaveBeenCalledOnce();
  });

  it('should handle cleanup errors', async () => {
    const { runFullCleanup } = (await import('@/lib/cleanup')).DatabaseCleanup;
    vi.mocked(runFullCleanup).mockRejectedValue(new Error('Cleanup failed'));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error', 'Failed to get stats');
  });
});
