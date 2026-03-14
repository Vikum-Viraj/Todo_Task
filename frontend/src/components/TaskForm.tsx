import { useState } from 'react';
import { toast } from 'react-toastify';
import type { CreateTaskRequest } from '../services/taskService';
import { taskService } from '../services/taskService';

interface TaskFormProps {
  onTaskCreated?: () => void;
  onCancel?: () => void;
  showActionButtons?: boolean;
}

export const TaskForm = ({ onTaskCreated, onCancel, showActionButtons = false }: TaskFormProps) => {
  const [formData, setFormData] = useState<CreateTaskRequest>({
    title: '',
    description: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

      // Reset form
      setFormData({ title: '', description: '' });
      
      // Show success toast
      toast.success('Task created successfully!');
      
      // Call callback if provided
      if (onTaskCreated) {
        onTaskCreated();
      }
    } catch (err) {
      setFormError('Failed to create task. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
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
          rows={showActionButtons ? 6 : 4}
          disabled={submitting}
          maxLength={500}
        />
      </div>

      {showActionButtons ? (
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-cancel"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-submit"
            disabled={submitting}
          >
            {submitting ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      ) : (
        <button 
          type="submit" 
          className="btn-add"
          disabled={submitting}
        >
          {submitting ? 'Adding...' : 'ADD'}
        </button>
      )}
    </form>
  );
};
