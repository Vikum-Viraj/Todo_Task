import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CreateTaskRequest } from '../services/taskService';
import { taskService } from '../services/taskService';
import '../styles/CreateTaskPage.css';

export const CreateTaskPage = () => {
  const [formData, setFormData] = useState<CreateTaskRequest>({
    title: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError('Task title is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Task description is required');
      return false;
    }
    if (formData.title.trim().length > 100) {
      setError('Title must be 100 characters or less');
      return false;
    }
    if (formData.description.trim().length > 500) {
      setError('Description must be 500 characters or less');
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
      setLoading(true);
      setError(null);
      
      await taskService.createTask({
        title: formData.title.trim(),
        description: formData.description.trim(),
      });

      // Redirect to home page
      navigate('/');
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
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

        <form onSubmit={handleSubmit} className="task-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="title">Task Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              maxLength={100}
              disabled={loading}
            />
            <span className="char-count">
              {formData.title.length}/100
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="description">Task Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
              rows={6}
              maxLength={500}
              disabled={loading}
            />
            <span className="char-count">
              {formData.description.length}/500
            </span>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
