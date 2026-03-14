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

export interface ApiResponse<T> {
  data: T;
  message: string | null;
  success: boolean;
}

export const taskService = {
  /**
   * GET /api/todos
   * Fetch the latest 5 incomplete todos
   */
  getAllTasks: async (): Promise<Task[]> => {
    try {
      const response = await axiosInstance.get<ApiResponse<Task[]>>('/todos');
      return response.data.data;
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
      const response = await axiosInstance.post<ApiResponse<Task>>('/todos', taskData);
      return response.data.data;
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
      const response = await axiosInstance.put<ApiResponse<Task>>(`/todos/${taskId}/done`);
      return response.data.data;
    } catch (error) {
      console.error('Error marking task as done:', error);
      throw error;
    }
  },

  /**
   * PUT /api/todos/{id}
   * Update a todo task
   * @param taskId - ID of the task to update
   * @param taskData - Object containing title and description
   */
  updateTask: async (taskId: number, taskData: CreateTaskRequest): Promise<Task> => {
    try {
      const response = await axiosInstance.put<ApiResponse<Task>>(`/todos/${taskId}`, taskData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },
};
