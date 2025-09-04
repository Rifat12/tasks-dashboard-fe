import { useState, useEffect, useCallback } from 'react';
import type { Task, TaskInput, TaskStatusUpdate } from '../types/task';
import { taskApi } from '../services/api';

interface UseTasksReturn {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;
    createTask: (taskData: TaskInput) => Promise<void>;
    updateTaskStatus: (id: string, status: TaskStatusUpdate['status']) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    refreshTasks: () => Promise<void>;
}

export const useTasks = (): UseTasksReturn => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTasks = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const fetchedTasks = await taskApi.getTasks();
            setTasks(fetchedTasks);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
            console.error('Error fetching tasks:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createTask = useCallback(async (taskData: TaskInput) => {
        try {
            setError(null);
            const newTask = await taskApi.createTask(taskData);
            setTasks(prev => [newTask, ...prev]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create task');
            console.error('Error creating task:', err);
            throw err;
        }
    }, []);

    const updateTaskStatus = useCallback(async (id: string, status: TaskStatusUpdate['status']) => {
        try {
            setError(null);
            const updatedTask = await taskApi.updateTaskStatus(id, { status });
            setTasks(prev => prev.map(task =>
                task.id === id ? updatedTask : task
            ));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update task status');
            console.error('Error updating task status:', err);
            throw err;
        }
    }, []);

    const deleteTask = useCallback(async (id: string) => {
        try {
            setError(null);
            await taskApi.deleteTask(id);
            setTasks(prev => prev.filter(task => task.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete task');
            console.error('Error deleting task:', err);
            throw err;
        }
    }, []);

    const refreshTasks = useCallback(async () => {
        await fetchTasks();
    }, [fetchTasks]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    return {
        tasks,
        isLoading,
        error,
        createTask,
        updateTaskStatus,
        deleteTask,
        refreshTasks,
    };
};
