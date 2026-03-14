import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import type { Task } from '../services/taskService';
import { taskService } from '../services/taskService';
import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import '../styles/HomePage.css';

export const HomePage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await taskService.getAllTasks();
      // Filter out completed tasks and get only the most recent 5
      const incompleteTasks = fetchedTasks
        .filter(task => !task.completed)
        .slice(0, 5);
      setTasks(incompleteTasks);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = () => {
    fetchTasks();
  };

  const handleMarkDone = async (taskId: number) => {
    try {
      await taskService.markTaskDone(taskId);
      toast.success('Task marked as done!');
      fetchTasks();
    } catch (err) {
      setError('Failed to mark task as done.');
      toast.error('Failed to mark task as done.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="content-wrapper">
          {/* Left Column: Add Task Form */}
          <div className="form-section">
            <h2 className="section-title">Add a Task</h2>
            <TaskForm onTaskCreated={handleTaskCreated} />
          </div>

          {/* Right Column: Task List */}
          <div className="tasks-section">
            <h2 className="section-title">Your Tasks</h2>
            
            {loading && (
              <div className="loading-container">
                <p>Loading your tasks...</p>
              </div>
            )}

            {error && !loading && (
              <div className="error-container">
                <p>{error}</p>
                <button onClick={fetchTasks} className="btn-retry">Retry</button>
              </div>
            )}

            {!loading && tasks.length === 0 && !error && (
              <div className="empty-state">
                <p>No pending tasks yet!</p>
                <p>Create one to get started.</p>
              </div>
            )}

            {!loading && tasks.length > 0 && (
              <div className="tasks-list">
                {tasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onMarkDone={handleMarkDone}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
