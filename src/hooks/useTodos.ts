import { useState, useCallback, useEffect } from 'react';
import { todoApi } from '@/lib/api';
import { TodoForm, Todo } from '@/types/todo';

export const useTodos = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);

  console.log('todos', todos);

  const refreshTodos = useCallback(async () => {
    try {
      const response = await todoApi.getAll();
      setTodos(response);
      return response;
    } catch {
      setError('Failed to refresh todos');
      return null;
    }
  }, []);

  useEffect(() => {
    refreshTodos();
  }, []);

  const createTodo = async (data: TodoForm) => {
    setLoading(true);
    setError(null);
    try {
      await todoApi.create(data).then((response) => {
        setTodos((prev) => [...prev, response.todo as unknown as Todo]);
      });
      return { success: true };
    } catch (err) {
      setError('Failed to create todo');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const updateTodo = async (id: string, data: TodoForm) => {
    setLoading(true);
    setError(null);
    try {
      await todoApi.update(id, data).then((response) => {
        setTodos((prev) =>
          prev.map((todo) =>
            todo.id === parseInt(id) ? { ...todo, ...response.todo } : todo
          )
        );
        console.log('response', response);
      });
      return { success: true };
    } catch (err) {
      setError('Failed to update todo');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await todoApi.delete(id).then(() => {
        setTodos((prev) => prev.filter((todo) => todo.id !== parseInt(id)));
      });
      return { success: true };
    } catch (err) {
      setError('Failed to delete todo');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  return {
    todos,
    loading,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    refreshTodos,
  };
};
