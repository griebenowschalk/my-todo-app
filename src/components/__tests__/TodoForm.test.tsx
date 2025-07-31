import { vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { TodoForm } from '../TodoForm';
import { Todo } from '@/types/todo';
import { TodoProvider } from '@/contexts/TodoContext';
import userEvent from '@testing-library/user-event';

const mockCreateTodo = vi.fn().mockResolvedValue({ success: true });
const mockUpdateTodo = vi.fn().mockResolvedValue({ success: true });
const mockDeleteTodo = vi.fn().mockResolvedValue({ success: true });
const mockRefreshTodos = vi.fn().mockResolvedValue([]);

vi.mock('@/hooks/useTodos', () => ({
  useTodos: () => ({
    todos: [],
    loading: false,
    error: null,
    createTodo: mockCreateTodo,
    updateTodo: mockUpdateTodo,
    deleteTodo: mockDeleteTodo,
    refreshTodos: mockRefreshTodos,
  }),
}));

describe('TodoForm', () => {
  const todo: Todo = {
    id: 1,
    title: 'Test Todo',
    description: 'Test Description',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the todo form', () => {
    render(
      <TodoProvider>
        <TodoForm open={true} onClose={() => {}} todo={null} />
      </TodoProvider>
    );

    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();

    const dialogTitle = screen.getByTestId('dialog-title');
    expect(dialogTitle).toHaveTextContent('Add Todo');

    const dialogDescription = screen.getByTestId('dialog-description');
    expect(dialogDescription).toHaveTextContent('Add a new todo');

    const titleInput = screen.getByTestId('title-input');
    expect(titleInput).toBeInTheDocument();
    expect(titleInput).toHaveValue('');

    const descriptionInput = screen.getByTestId('description-input');
    expect(descriptionInput).toBeInTheDocument();
    expect(descriptionInput).toHaveValue('');
  });

  it('renders the todo form with a todo', async () => {
    await act(async () => {
      render(
        <TodoProvider>
          <TodoForm open={true} onClose={() => {}} todo={todo} />
        </TodoProvider>
      );
    });

    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();

    const dialogTitle = screen.getByTestId('dialog-title');
    expect(dialogTitle).toHaveTextContent('Edit Todo');

    const dialogDescription = screen.getByTestId('dialog-description');
    expect(dialogDescription).toHaveTextContent('Edit the todo');

    const titleInput = screen.getByTestId('title-input');
    expect(titleInput).toBeInTheDocument();
    expect(titleInput).toHaveValue(todo.title);

    const descriptionInput = screen.getByTestId('description-input');
    expect(descriptionInput).toBeInTheDocument();
    expect(descriptionInput).toHaveValue(todo.description);
  });

  it('should handle form submission for edit', async () => {
    const onClose = vi.fn();

    await act(async () => {
      render(
        <TodoProvider>
          <TodoForm open={true} onClose={onClose} todo={todo} />
        </TodoProvider>
      );
    });

    const submitButton = screen.getByTestId('submit-button');
    expect(submitButton).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(submitButton);

    expect(onClose).toHaveBeenCalledOnce();
    expect(mockUpdateTodo).toHaveBeenCalledWith('1', {
      title: 'Test Todo',
      description: 'Test Description',
    });
  });

  it('should handle form submission for create', async () => {
    const onClose = vi.fn();

    await act(async () => {
      render(
        <TodoProvider>
          <TodoForm open={true} onClose={onClose} todo={null} />
        </TodoProvider>
      );
    });

    const titleInput = screen.getByTestId('title-input');
    const descriptionInput = screen.getByTestId('description-input');
    const submitButton = screen.getByTestId('submit-button');

    const user = userEvent.setup();
    await user.type(titleInput, 'New Todo');
    await user.type(descriptionInput, 'New Description');
    await user.click(submitButton);

    expect(onClose).toHaveBeenCalledOnce();
    expect(mockCreateTodo).toHaveBeenCalledWith({
      title: 'New Todo',
      description: 'New Description',
    });
  });
});
