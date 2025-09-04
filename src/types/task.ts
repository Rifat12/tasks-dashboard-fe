export interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'pending' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    createdAt: string;
    updatedAt: string;
}

export interface TaskInput {
    title: string;
    description?: string;
    status?: 'pending' | 'in-progress' | 'completed';
    priority?: 'low' | 'medium' | 'high';
}

export interface TaskStatusUpdate {
    status: 'pending' | 'in-progress' | 'completed';
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface ErrorResponse {
    success: false;
    error: string;
    message?: string;
}
