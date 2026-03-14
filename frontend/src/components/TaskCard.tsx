import type { Task } from '../services/taskService';
import '../styles/TaskCard.css';

interface TaskCardProps {
  task: Task;
  onMarkDone: (taskId: number) => void;
}

export const TaskCard = ({ task, onMarkDone }: TaskCardProps) => {
  const formattedDate = new Date(task.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="task-card">
      <div className="task-content">
        <h3 className="task-title">{task.title}</h3>
        <p className="task-description">{task.description}</p>
        <span className="task-date">{formattedDate}</span>
      </div>
      <button
        className="btn-done"
        onClick={() => onMarkDone(task.id)}
        disabled={task.completed}
      >
        {task.completed ? '✓ Completed' : '✓ Mark Done'}
      </button>
    </div>
  );
};
