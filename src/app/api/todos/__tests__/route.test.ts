import { vi } from 'vitest';
import { GET, POST } from '../route';
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

// Mock the database
vi.mock('@/db', () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        limit: vi.fn(() =>
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
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(() =>
          Promise.resolve([
            {
              id: 1,
              title: 'New Todo',
              description: 'New Description',
              completed: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ])
        ),
      })),
    })),
  },
  Todos: {},
}));

describe('/api/todos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('should return all todos', async () => {
      const response = await GET(
        new NextRequest('http://localhost:3000/api/todos')
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data[0]).toHaveProperty('id');
      expect(data[0]).toHaveProperty('title');
    });

    it('should handle database errors', async () => {
      const { db } = await import('@/db');
      vi.mocked(db.select).mockImplementation(() => {
        throw new Error('Database error');
      });

      const response = await GET(
        new NextRequest('http://localhost:3000/api/todos')
      );
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toHaveProperty('error');
    });
  });

  describe('POST', () => {
    it('should create a new todo', async () => {
      const todoData = {
        title: 'New Todo',
        description: 'New Description',
      };

      const request = new NextRequest('http://localhost:3000/api/todos', {
        method: 'POST',
        body: JSON.stringify(todoData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toHaveProperty('todo');
      expect(data.todo.title).toBe('New Todo');
    });

    it('should handle invalid request body', async () => {
      const request = new NextRequest('http://localhost:3000/api/todos', {
        method: 'POST',
        body: 'invalid json',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toHaveProperty('error', 'Failed to create todo');
    });

    it('should handle missing title', async () => {
      const { validateTodoInput } = await import('@/lib/middleware');
      vi.mocked(validateTodoInput).mockReturnValue({
        isValid: false,
        errors: ['Title is required'],
      });

      const todoData = {
        description: 'New Description',
      };

      const request = new NextRequest('http://localhost:3000/api/todos', {
        method: 'POST',
        body: JSON.stringify(todoData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error', 'Invalid input');
      expect(data).toHaveProperty('details');
    });

    it('should handle database errors', async () => {
      const { db } = await import('@/db');
      vi.mocked(db.insert).mockImplementation(() => {
        throw new Error('Database error');
      });

      const todoData = {
        title: 'New Todo',
        description: 'New Description',
      };

      const request = new NextRequest('http://localhost:3000/api/todos', {
        method: 'POST',
        body: JSON.stringify(todoData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error', 'Invalid input');
    });
  });
});
