import { TodoForm } from '@/types/todo';

// Centralized API calls
export const todoApi = {
  getAll: () => fetch('/api/todos').then((res) => res.json()),
  create: (data: TodoForm) =>
    fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
  update: (id: string, data: TodoForm) =>
    fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((res) => res.json()),
  delete: (id: string) => fetch(`/api/todos/${id}`, { method: 'DELETE' }),
};
