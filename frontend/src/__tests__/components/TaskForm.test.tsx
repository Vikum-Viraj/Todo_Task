import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskForm } from '../../components/TaskForm';
import { taskService } from '../../services/taskService';

vi.mock('../../services/taskService');
vi.mock('react-toastify');

describe('TaskForm - Todo Add Form', () => {
  const mockOnTaskCreated = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form with title and description inputs and add button', () => {
    render(
      <TaskForm onTaskCreated={mockOnTaskCreated} />
    );

    expect(screen.getByPlaceholderText('Enter task title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter task description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('shows validation error when submitting empty title', async () => {
    const user = userEvent.setup();
    render(
      <TaskForm onTaskCreated={mockOnTaskCreated} />
    );

    const button = screen.getByRole('button', { name: /add/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('Task title is required')).toBeInTheDocument();
    });
  });

  it('creates task and calls onTaskCreated callback on valid form submission', async () => {
    const user = userEvent.setup();
    vi.mocked(taskService.createTask).mockResolvedValue({
      id: 1,
      title: 'Test Task',
      description: 'Test Description',
      completed: false,
      createdAt: '2024-03-14T10:00:00Z',
    });

    render(
      <TaskForm onTaskCreated={mockOnTaskCreated} />
    );

    const titleInput = screen.getByPlaceholderText('Enter task title');
    const descInput = screen.getByPlaceholderText('Enter task description');

    await user.type(titleInput, 'Test Task');
    await user.type(descInput, 'Test Description');

    const button = screen.getByRole('button', { name: /add/i });
    await user.click(button);

    await waitFor(() => {
      expect(taskService.createTask).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description',
      });
      expect(mockOnTaskCreated).toHaveBeenCalled();
    });
  });
});
