import { useState, useEffect } from 'react';
import type { Task } from '../services/taskService';
import { taskService, type CreateTaskRequest } from '../services/taskService';
import '../styles/HomePage.css';

export const HomePage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateTaskRequest>({
    title: '',
    description: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (formError) setFormError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setFormError('Task title is required');
      return false;
    }
    if (!formData.description.trim()) {
      setFormError('Task description is required');
      return false;
    }
    if (formData.title.trim().length > 100) {
      setFormError('Title must be 100 characters or less');
      return false;
    }
    if (formData.description.trim().length > 500) {
      setFormError('Description must be 500 characters or less');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);
      
      await taskService.createTask({
        title: formData.title.trim(),
        description: formData.description.trim(),
      });

      // Reset form and refresh tasks
      setFormData({ title: '', description: '' });
      fetchTasks();
    } catch (err) {
      setFormError('Failed to create task. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkDone = async (taskId: number) => {
    try {
      await taskService.markTaskDone(taskId);
      fetchTasks();
    } catch (err) {
      setError('Failed to mark task as done.');
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
            <form onSubmit={handleSubmit} className="add-task-form">
              {formError && <div className="form-error">{formError}</div>}
              
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="Enter task title"
                  disabled={submitting}
                  maxLength={100}
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Enter task description"
                  rows={4}
                  disabled={submitting}
                  maxLength={500}
                />
              </div>

              <button 
                type="submit" 
                className="btn-add"
                disabled={submitting}
              >
                {submitting ? 'Adding...' : 'ADD'}
              </button>
            </form>
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
                  <div key={task.id} className="task-item">
                    <div className="task-info">
                      <h3 className="task-title">{task.title}</h3>
                      <p className="task-description">{task.description}</p>
                    </div>
                    <button
                      className="btn-done"
                      onClick={() => handleMarkDone(task.id)}
                      disabled={task.completed}
                    >
                      Done
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
