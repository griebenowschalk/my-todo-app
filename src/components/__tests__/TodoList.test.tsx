import { vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { TodoList } from '../TodoList';

// Create a mock function that returns the hook state
const mockUseTodos = vi.fn();

// Mock the useTodos hook
vi.mock('@/hooks/useTodos', () => ({
  useTodos: mockUseTodos,
}));

// Mock the TodoContext to use our mocked hook
vi.mock('@/contexts/TodoContext', () => ({
  TodoProvider: ({ children }: { children: React.ReactNode }) => children,
  useTodoContext: () => mockUseTodos(),
}));

import { TodoProvider } from '@/contexts/TodoContext';
import userEvent from '@testing-library/user-event';

describe('TodoList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render no todos', async () => {
    // Mock the hook to return no todos and not loading
    mockUseTodos.mockReturnValue({
      todos: [],
      loading: false,
      error: null,
      createTodo: vi.fn(),
      updateTodo: vi.fn(),
      deleteTodo: vi.fn(),
      refreshTodos: vi.fn(),
    });

    await act(async () => {
      render(
        <TodoProvider>
          <TodoList />
        </TodoProvider>
      );
    });

    const noTodos = screen.getByTestId('no-todos');
    expect(noTodos).toBeInTheDocument();
  });

  it('should render skeleton when loading', async () => {
    // Mock the hook to return loading state
    mockUseTodos.mockReturnValue({
      todos: [],
      loading: true,
      error: null,
      createTodo: vi.fn(),
      updateTodo: vi.fn(),
      deleteTodo: vi.fn(),
      refreshTodos: vi.fn(),
    });

    render(
      <TodoProvider>
        <TodoList />
      </TodoProvider>
    );

    const skeleton1 = screen.getByTestId('skeleton-1');
    expect(skeleton1).toBeInTheDocument();

    const skeleton2 = screen.getByTestId('skeleton-2');
    expect(skeleton2).toBeInTheDocument();
  });

  it('should render todos', async () => {
    mockUseTodos.mockReturnValue({
      todos: [
        {
          id: 1,
          title: 'Test Todo',
          description: 'Test Description',
          completed: false,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      ],
      loading: false,
      error: null,
      createTodo: vi.fn(),
      updateTodo: vi.fn(),
      deleteTodo: vi.fn(),
      refreshTodos: vi.fn(),
    });

    await act(async () => {
      render(
        <TodoProvider>
          <TodoList />
        </TodoProvider>
      );
    });

    const todo = screen.getByTestId('todo-1');
    expect(todo).toBeInTheDocument();

    const todoTitle = screen.getByText('Test Todo');
    expect(todoTitle).toBeInTheDocument();

    const todoDescription = screen.getByText('Test Description');
    expect(todoDescription).toBeInTheDocument();
  });

  it('should render add todo button and open dialog', async () => {
    render(
      <TodoProvider>
        <TodoList />
      </TodoProvider>
    );

    const addTodoButton = screen.getByTestId('add-todo');
    expect(addTodoButton).toBeInTheDocument();

    const user = userEvent.setup();

    await user.click(addTodoButton);

    const dialogTitle = screen.getByTestId('dialog-title');
    expect(dialogTitle).toHaveTextContent('Add Todo');

    const dialogDescription = screen.getByTestId('dialog-description');
    expect(dialogDescription).toHaveTextContent('Add a new todo');
  });

  it('should render edit todo button and open dialog', async () => {
    mockUseTodos.mockReturnValue({
      todos: [
        {
          id: 1,
          title: 'Test Todo',
          description: 'Test Description',
          completed: false,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      ],
      loading: false,
      error: null,
      createTodo: vi.fn(),
      updateTodo: vi.fn(),
      deleteTodo: vi.fn(),
      refreshTodos: vi.fn(),
    });

    await act(async () => {
      render(
        <TodoProvider>
          <TodoList />
        </TodoProvider>
      );
    });

    const todo = screen.getByTestId('todo-1');
    expect(todo).toBeInTheDocument();

    const user = userEvent.setup();

    await user.click(todo);

    const dialogTitle = screen.getByTestId('dialog-title');
    expect(dialogTitle).toHaveTextContent('Edit Todo');

    const dialogDescription = screen.getByTestId('dialog-description');
    expect(dialogDescription).toHaveTextContent('Edit the todo');

    const titleInput = screen.getByTestId('title-input');
    expect(titleInput).toHaveValue('Test Todo');

    const descriptionInput = screen.getByTestId('description-input');
    expect(descriptionInput).toHaveValue('Test Description');
  });
});
