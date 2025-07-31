import { vi } from 'vitest';

// Mock the database
vi.mock('@/db', () => ({
  db: {
    delete: vi.fn(),
  },
  todos: {},
}));

describe('cleanup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should cleanup old todos', async () => {
    const { db } = await import('@/db');
    const mockDelete = vi.mocked(db.delete);

    // Mock the chained calls
    mockDelete.mockReturnValue({
      where: vi.fn().mockReturnValue({
        rowCount: 2,
      }),
    } as unknown as ReturnType<typeof db.delete>);

    const { DatabaseCleanup } = await import('../cleanup');
    const result = await DatabaseCleanup.removeOldTodos();

    expect(result).toHaveProperty('deleted');
    expect(mockDelete).toHaveBeenCalled();
  });

  it('should handle database errors', async () => {
    const { db } = await import('@/db');
    const mockDelete = vi.mocked(db.delete);

    mockDelete.mockImplementation(() => {
      throw new Error('Database error');
    });

    const { DatabaseCleanup } = await import('../cleanup');
    await expect(DatabaseCleanup.removeOldTodos()).rejects.toThrow(
      'Database error'
    );
  });

  it('should return zero deleted count when no old todos', async () => {
    const { db } = await import('@/db');
    const mockDelete = vi.mocked(db.delete);

    // Mock the chained calls
    mockDelete.mockReturnValue({
      where: vi.fn().mockReturnValue({
        rowCount: 0,
      }),
    } as unknown as ReturnType<typeof db.delete>);

    const { DatabaseCleanup } = await import('../cleanup');
    const result = await DatabaseCleanup.removeOldTodos();

    expect(result.deleted).toBe(0);
  });
});
