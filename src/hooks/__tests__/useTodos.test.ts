import { renderHook, act, waitFor } from '@testing-library/react';
import { useTodos } from '../useTodos';
import { todoApi } from '@/lib/api';
import { TodoForm, Todo } from '@/types/todo';

vi.mock('@/lib/api', () => ({
  todoApi: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockTodoApi = todoApi as {
  getAll: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

describe('useTodos', () => {
  const mockTodos: Todo[] = [
    {
      id: 1,
      title: 'Test Todo 1',
      description: 'Description 1',
      completed: false,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 2,
      title: 'Test Todo 2',
      description: 'Description 2',
      completed: true,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
  ];

  describe('initialization', () => {
    it('should initialize with default values', () => {
      mockTodoApi.getAll.mockResolvedValue(mockTodos);

      const { result } = renderHook(() => useTodos());

      expect(result.current.todos).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should fetch todos on mount', async () => {
      mockTodoApi.getAll.mockResolvedValue(mockTodos);

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(mockTodoApi.getAll).toHaveBeenCalledTimes(1);
        expect(result.current.todos).toEqual(mockTodos);
      });
    });

    it('should handle fetch error on mount', async () => {
      mockTodoApi.getAll.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.error).toBe('Failed to refresh todos');
        expect(result.current.todos).toEqual([]);
      });
    });
  });

  describe('refreshTodos', () => {
    it('should refresh todos successfully', async () => {
      mockTodoApi.getAll.mockResolvedValue(mockTodos);

      const { result } = renderHook(() => useTodos());

      await act(async () => {
        const response = await result.current.refreshTodos();
        expect(response).toEqual(mockTodos);
      });

      expect(result.current.todos).toEqual(mockTodos);
    });

    it('should handle refresh error', async () => {
      const error = new Error('Network error');
      mockTodoApi.getAll.mockRejectedValue(error);

      const { result } = renderHook(() => useTodos());

      await act(async () => {
        const response = await result.current.refreshTodos();
        expect(response).toEqual({ error });
      });

      expect(result.current.error).toBe('Failed to refresh todos');
    });
  });

  describe('createTodo', () => {
    const newTodoForm: TodoForm = {
      title: 'New Todo',
      description: 'New Description',
      completed: false,
    };

    const newTodo: Todo = {
      id: 3,
      title: 'New Todo',
      description: 'New Description',
      completed: false,
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03'),
    };

    it('should create todo successfully', async () => {
      mockTodoApi.getAll.mockResolvedValue([]);
      mockTodoApi.create.mockResolvedValue({ todo: newTodo });

      const { result } = renderHook(() => useTodos());

      await act(async () => {
        const response = await result.current.createTodo(newTodoForm);
        expect(response).toEqual({ success: true });
      });

      expect(mockTodoApi.create).toHaveBeenCalledWith(newTodoForm);
      expect(result.current.todos).toContain(newTodo);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle create error', async () => {
      mockTodoApi.getAll.mockResolvedValue([]);
      const error = new Error('Create failed');
      mockTodoApi.create.mockRejectedValue(error);

      const { result } = renderHook(() => useTodos());

      await act(async () => {
        const response = await result.current.createTodo(newTodoForm);
        expect(response).toEqual({ success: false, error });
      });

      expect(result.current.error).toBe('Failed to create todo');
      expect(result.current.loading).toBe(false);
    });

    it('should set loading state during create', async () => {
      mockTodoApi.getAll.mockResolvedValue([]);
      mockTodoApi.create.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ todo: newTodo }), 100)
          )
      );

      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.createTodo(newTodoForm);
      });

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('updateTodo', () => {
    const updateForm: TodoForm = {
      title: 'Updated Todo',
      description: 'Updated Description',
      completed: true,
    };

    const updatedTodo: Todo = {
      id: 1,
      title: 'Updated Todo',
      description: 'Updated Description',
      completed: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-03'),
    };

    beforeEach(async () => {
      mockTodoApi.getAll.mockResolvedValue(mockTodos);
    });

    it('should update todo successfully', async () => {
      mockTodoApi.update.mockResolvedValue({ todo: updatedTodo });

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.todos).toEqual(mockTodos);
      });

      await act(async () => {
        const response = await result.current.updateTodo('1', updateForm);
        expect(response).toEqual({ success: true });
      });

      expect(mockTodoApi.update).toHaveBeenCalledWith('1', updateForm);
      expect(result.current.todos[0]).toMatchObject(updatedTodo);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle update error', async () => {
      const error = new Error('Update failed');
      mockTodoApi.update.mockRejectedValue(error);

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.todos).toEqual(mockTodos);
      });

      await act(async () => {
        const response = await result.current.updateTodo('1', updateForm);
        expect(response).toEqual({ success: false, error });
      });

      expect(result.current.error).toBe('Failed to update todo');
      expect(result.current.loading).toBe(false);
    });
  });

  describe('deleteTodo', () => {
    beforeEach(async () => {
      mockTodoApi.getAll.mockResolvedValue(mockTodos);
    });

    it('should delete todo successfully', async () => {
      mockTodoApi.delete.mockResolvedValue({});

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.todos).toEqual(mockTodos);
      });

      await act(async () => {
        const response = await result.current.deleteTodo('1');
        expect(response).toEqual({ success: true });
      });

      expect(mockTodoApi.delete).toHaveBeenCalledWith('1');
      expect(result.current.todos).toHaveLength(1);
      expect(
        result.current.todos.find((todo) => todo.id === 1)
      ).toBeUndefined();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle delete error', async () => {
      const error = new Error('Delete failed');
      mockTodoApi.delete.mockRejectedValue(error);

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.todos).toEqual(mockTodos);
      });

      await act(async () => {
        const response = await result.current.deleteTodo('1');
        expect(response).toEqual({ success: false, error });
      });

      expect(result.current.error).toBe('Failed to delete todo');
      expect(result.current.loading).toBe(false);
      expect(result.current.todos).toEqual(mockTodos);
    });
  });

  describe('error handling', () => {
    it('should clear error on successful operation after error', async () => {
      mockTodoApi.getAll.mockRejectedValue(new Error('Initial error'));
      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.error).toBe('Failed to refresh todos');
      });

      mockTodoApi.create.mockResolvedValue({
        todo: {
          id: 1,
          title: 'Test',
          description: '',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      await act(async () => {
        await result.current.createTodo({
          title: 'Test',
          description: '',
          completed: false,
        });
      });

      expect(result.current.error).toBe(null);
    });
  });
});
