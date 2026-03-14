import { useNavigate } from 'react-router-dom';
import { TaskForm } from '../components/TaskForm';
import '../styles/CreateTaskPage.css';

export const CreateTaskPage = () => {
  const navigate = useNavigate();

  const handleTaskCreated = () => {
    // Redirect to home page after task is created
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="create-task-page">
      <div className="create-task-container">
        <div className="create-task-header">
          <h2>Create New Task</h2>
          <p>Add a new task to your todo list</p>
        </div>

        <TaskForm 
          onTaskCreated={handleTaskCreated} 
          onCancel={handleCancel}
          showActionButtons={true}
        />
      </div>
    </div>
  );
};
