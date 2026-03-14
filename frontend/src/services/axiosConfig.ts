import axiosInstance from './axiosConfig';

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
}

export const taskService = {
  /**
   * GET /api/todos
   * Fetch the latest 5 incomplete todos
   */
  getAllTasks: async (): Promise<Task[]> => {
    try {
      const response = await axiosInstance.get<Task[]>('/todos');
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  /**
   * POST /api/todos
   * Create a new todo task
   * @param taskData - Object containing title and description
   */
  createTask: async (taskData: CreateTaskRequest): Promise<Task> => {
    try {
      const response = await axiosInstance.post<Task>('/todos', taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  /**
   * PUT /api/todos/{id}/done
   * Mark a todo as completed
   * @param taskId - ID of the task to mark as done
   */
  markTaskDone: async (taskId: number): Promise<Task> => {
    try {
      const response = await axiosInstance.put<Task>(`/todos/${taskId}/done`);
      return response.data;
    } catch (error) {
      console.error('Error marking task as done:', error);
      throw error;
    }
  },
};
