'use client';
import { createContext, useContext, ReactNode } from 'react';
import { useTodos } from '@/hooks/useTodos';
import { Todo, TodoForm } from '@/types/todo';

interface TodoContextType {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  createTodo: (data: TodoForm) => Promise<{ success: boolean }>;
  updateTodo: (id: string, data: TodoForm) => Promise<{ success: boolean }>;
  deleteTodo: (id: string) => Promise<{ success: boolean }>;
  refreshTodos: () => Promise<Todo[] | null>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const todoActions = useTodos();

  return (
    <TodoContext.Provider value={todoActions}>{children}</TodoContext.Provider>
  );
};

export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
};
