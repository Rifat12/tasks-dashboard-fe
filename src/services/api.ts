import axios from 'axios';
import type { Task, TaskInput, TaskStatusUpdate, ApiResponse } from '../types/task';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const taskApi = {
    // Get all tasks
    getTasks: async (): Promise<Task[]> => {
        const response = await api.get<ApiResponse<Task[]>>('/api/tasks');
        return response.data.data;
    },

    // Get task by ID
    getTask: async (id: string): Promise<Task> => {
        const response = await api.get<ApiResponse<Task>>(`/api/tasks/${id}`);
        return response.data.data;
    },

    // Create new task
    createTask: async (taskData: TaskInput): Promise<Task> => {
        const response = await api.post<ApiResponse<Task>>('/api/tasks', taskData);
        return response.data.data;
    },

    // Update task status
    updateTaskStatus: async (id: string, statusUpdate: TaskStatusUpdate): Promise<Task> => {
        const response = await api.put<ApiResponse<Task>>(`/api/tasks/${id}/status`, statusUpdate);
        return response.data.data;
    },

    // Delete task
    deleteTask: async (id: string): Promise<void> => {
        await api.delete(`/api/tasks/${id}`);
    },

    // Health check
    healthCheck: async (): Promise<any> => {
        const response = await api.get('/health');
        return response.data;
    },
};

export default taskApi;
