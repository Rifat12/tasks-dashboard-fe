import { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { useTasks } from './hooks/useTasks';
import { getLocal, setLocal } from './utils/storage';
import type { TaskInput } from './types/task';
import './App.css';

type FilterType = 'all' | 'pending' | 'completed' | 'high';

function AppContent() {
  const { 
    tasks, 
    isLoading, 
    error, 
    createTask, 
    updateTaskStatus, 
    deleteTask, 
    refreshTasks 
  } = useTasks();
  
  const [isCreating, setIsCreating] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>(getLocal('activeTab', 'all'));

  // Save active tab to localStorage
  useEffect(() => {
    setLocal('activeTab', activeFilter);
  }, [activeFilter]);

  const handleCreateTask = async (taskData: TaskInput) => {
    try {
      setIsCreating(true);
      await createTask(taskData);
    } catch (err) {
      console.error('Failed to create task:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateTaskStatus(id, status as any);
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const filteredTasks = tasks.filter(task => {
    switch (activeFilter) {
      case 'pending':
        return task.status === 'pending';
      case 'completed':
        return task.status === 'completed';
      case 'high':
        return task.priority === 'high';
      default:
        return true;
    }
  });

  return (
    <div className="app">
      <header className="app-header">
        <h1>Task Dashboard</h1>
      </header>

      <main className="app-main">
        <div className="dashboard-container">
          <div className="sidebar">
            <TaskForm onSubmit={handleCreateTask} isLoading={isCreating} />
          </div>
          
          <div className="main-content">
            <div className="tasks-section">
              <div className="tasks-header">
                <h2>Tasks</h2>
              </div>
              
              {error && (
                <div className="error-banner">
                  <span>⚠️ {error}</span>
                  <button onClick={refreshTasks} className="retry-button">
                    Retry
                  </button>
                </div>
              )}
              
              <TaskList
                tasks={filteredTasks}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                isLoading={isLoading}
                activeFilter={activeFilter}
                onFilterChange={(filter) => setActiveFilter(filter as FilterType)}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
