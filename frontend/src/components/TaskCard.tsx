import { useState } from 'react';
import type { Task } from '../services/taskService';
import { EditTaskModal } from './EditTaskModal';
import '../styles/TaskCard.css';

interface TaskCardProps {
  task: Task;
  onMarkDone: (taskId: number) => void;
  onTaskUpdated?: (updatedTask: Task) => void;
}

export const TaskCard = ({ task, onMarkDone, onTaskUpdated }: TaskCardProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(task);

  const formattedDate = new Date(currentTask.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleTaskUpdated = (updatedTask: Task) => {
    setCurrentTask(updatedTask);
    if (onTaskUpdated) {
      onTaskUpdated(updatedTask);
    }
  };

  return (
    <>
      <div className="task-card">
        <div className="task-content">
          <h3 className="task-title">{currentTask.title}</h3>
          <p className="task-description">{currentTask.description}</p>
          <span className="task-date">{formattedDate}</span>
        </div>
        <div className="task-buttons">
          <button
            className="btn-edit"
            onClick={() => setIsEditModalOpen(true)}
            disabled={currentTask.completed}
            title="Edit task"
          >
            ✎ Edit
          </button>
          <button
            className="btn-done"
            onClick={() => onMarkDone(currentTask.id)}
            disabled={currentTask.completed}
            title={currentTask.completed ? 'Task completed' : 'Mark as done'}
          >
            {currentTask.completed ? '✓ Completed' : '✓ Mark Done'}
          </button>
        </div>
      </div>

      <EditTaskModal
        task={currentTask}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onTaskUpdated={handleTaskUpdated}
      />
    </>
  );
};
