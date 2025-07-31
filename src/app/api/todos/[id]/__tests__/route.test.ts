import { vi } from 'vitest';
import { PATCH, DELETE } from '../route';
import { NextRequest } from 'next/server';

// Mock the middleware
vi.mock('@/lib/middleware', () => ({
  validateTodoInput: vi.fn(() => ({ isValid: true, errors: [] })),
  checkRateLimit: vi.fn(() => true),
  getClientIP: vi.fn(() => '127.0.0.1'),
  createRateLimitResponse: vi.fn(
    () => new Response('Rate limited', { status: 429 })
  ),
}));

vi.mock('@/db', () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() =>
          Promise.resolve([
            {
              id: 1,
              title: 'Test Todo',
              description: 'Test Description',
              completed: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ])
        ),
      })),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => ({
          returning: vi.fn(() =>
            Promise.resolve([
              {
                id: 1,
                title: 'Updated Todo',
                description: 'Updated Description',
                completed: true,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ])
          ),
        })),
      })),
    })),
    delete: vi.fn(() => ({
      where: vi.fn(() => Promise.resolve({ rowCount: 1 })),
    })),
  },
  Todos: {},
}));

describe('/api/todos/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('PATCH', () => {
    it('should update a todo', async () => {
      const todoData = {
        title: 'Updated Todo',
        description: 'Updated Description',
        completed: true,
      };

      const request = new NextRequest('http://localhost:3000/api/todos/1', {
        method: 'PATCH',
        body: JSON.stringify(todoData),
      });

      const params = Promise.resolve({ id: '1' });
      const response = await PATCH(request, { params });
      const data = await response.json();

      console.log('Response status:', response.status);
      console.log('Response data:', data);
      expect(response.status).toBe(200);
      expect(data).toHaveProperty('todo');
      expect(data.todo.title).toBe('Updated Todo');
    });

    it('should handle invalid request body', async () => {
      const request = new NextRequest('http://localhost:3000/api/todos/1', {
        method: 'PATCH',
        body: 'invalid json',
      });

      const params = Promise.resolve({ id: '1' });
      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toHaveProperty('error', 'Failed to update todo');
    });

    it('should handle todo not found', async () => {
      const { db } = await import('@/db');

      // Override select to return empty array (todo not found)
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn(() => ({
          where: vi.fn(() => Promise.resolve([])),
        })),
      } as unknown as ReturnType<typeof db.select>);

      const todoData = { title: 'Updated Todo' };
      const request = new NextRequest('http://localhost:3000/api/todos/999', {
        method: 'PATCH',
        body: JSON.stringify(todoData),
      });

      const params = Promise.resolve({ id: '999' });
      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty('error', 'Todo not found');
    });
  });

  describe('DELETE', () => {
    it('should delete a todo', async () => {
      const params = Promise.resolve({ id: '1' });
      const response = await DELETE({} as NextRequest, { params });

      expect(response.status).toBe(200);
    });

    it('should handle todo not found', async () => {
      const params = Promise.resolve({ id: '999' });
      const response = await DELETE({} as NextRequest, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('message', 'Todo deleted successfully');
    });
  });
});
