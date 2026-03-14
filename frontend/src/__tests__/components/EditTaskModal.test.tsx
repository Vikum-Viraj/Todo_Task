import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditTaskModal } from '../../components/EditTaskModal';
import { taskService } from '../../services/taskService';
import type { Task } from '../../services/taskService';

vi.mock('../../services/taskService');
vi.mock('react-toastify');

describe('EditTaskModal - Edit Todo', () => {
  const mockTask: Task = {
    id: 1,
    title: 'Original Task',
    description: 'Original Description',
    completed: false,
    createdAt: '2024-03-14T10:00:00Z',
  };

  const mockOnClose = vi.fn();
  const mockOnTaskUpdated = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render modal when isOpen is false', () => {
    const { container } = render(
      <EditTaskModal
        task={mockTask}
        isOpen={false}
        onClose={mockOnClose}
        onTaskUpdated={mockOnTaskUpdated}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('updates task and calls onTaskUpdated callback on successful submission', async () => {
    const user = userEvent.setup();
    const updatedTask: Task = {
      ...mockTask,
      title: 'Updated Task',
      description: 'Updated Description',
    };

    vi.mocked(taskService.updateTask).mockResolvedValue(updatedTask);

    render(
      <EditTaskModal
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
        onTaskUpdated={mockOnTaskUpdated}
      />
    );

    const titleInput = screen.getByDisplayValue('Original Task') as HTMLInputElement;
    const descInput = screen.getByDisplayValue('Original Description') as HTMLTextAreaElement;

    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Task');
    await user.clear(descInput);
    await user.type(descInput, 'Updated Description');

    const saveButton = screen.getByRole('button', { name: /save changes/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(taskService.updateTask).toHaveBeenCalledWith(mockTask.id, {
        title: 'Updated Task',
        description: 'Updated Description',
      });
      expect(mockOnTaskUpdated).toHaveBeenCalledWith(updatedTask);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
