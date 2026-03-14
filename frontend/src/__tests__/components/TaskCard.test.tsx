import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskCard } from '../../components/TaskCard';
import type { Task } from '../../services/taskService';

vi.mock('../../components/EditTaskModal', () => ({
  EditTaskModal: () => <div data-testid="edit-modal">Edit Modal</div>,
}));

describe('TaskCard - Mark Todo as Done', () => {
  const mockTask: Task = {
    id: 1,
    title: 'Complete Project',
    description: 'Finish the React project',
    completed: false,
    createdAt: '2024-03-14T10:00:00Z',
  };

  const completedTask: Task = {
    ...mockTask,
    completed: true,
  };

  const mockOnMarkDone = vi.fn();
  const mockOnTaskUpdated = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders done button and calls onMarkDone with task id when clicked', async () => {
    const user = userEvent.setup();
    render(
      <TaskCard
        task={mockTask}
        onMarkDone={mockOnMarkDone}
        onTaskUpdated={mockOnTaskUpdated}
      />
    );

    const doneButton = screen.getByRole('button', { name: /done/i });
    expect(doneButton).toBeInTheDocument();

    await user.click(doneButton);

    expect(mockOnMarkDone).toHaveBeenCalledWith(mockTask.id);
  });

  it('disables done button and shows completed state when task is completed', () => {
    render(
      <TaskCard
        task={completedTask}
        onMarkDone={mockOnMarkDone}
      />
    );

    const doneButton = screen.getByRole('button', { name: /completed/i });
    expect(doneButton).toBeDisabled();
  });
});
