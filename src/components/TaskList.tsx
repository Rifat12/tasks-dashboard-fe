import React, { useState, useEffect, useMemo } from 'react';
import type { Task } from '../types/task';
import TaskCard from './TaskCard';
import { getLocal, setLocal } from '../utils/storage';
import './TaskList.css';

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (id: string, status: Task['status']) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

type SortOption = 'newest' | 'oldest' | 'priority';

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onStatusChange, 
  onDelete, 
  isLoading = false,
  activeFilter,
  onFilterChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>(getLocal('sortBy', 'newest'));

  // Debounced search
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Save sort preference
  useEffect(() => {
    setLocal('sortBy', sortBy);
  }, [sortBy]);

  // Compute filtered and sorted tasks
  const processedTasks = useMemo(() => {
    let filtered = tasks;

    // Apply search filter
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query))
      );
    }

    // Sort tasks
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        default:
          return 0;
      }
    });

    return sorted;
  }, [tasks, debouncedSearchQuery, sortBy]);

  // Compute tab counts
  const tabCounts = useMemo(() => {
    const searchFiltered = debouncedSearchQuery ? 
      tasks.filter(task => {
        const query = debouncedSearchQuery.toLowerCase();
        return task.title.toLowerCase().includes(query) ||
               (task.description && task.description.toLowerCase().includes(query));
      }) : tasks;

    return {
      all: searchFiltered.length,
      pending: searchFiltered.filter(task => task.status === 'pending').length,
      completed: searchFiltered.filter(task => task.status === 'completed').length,
      high: searchFiltered.filter(task => task.priority === 'high').length,
    };
  }, [tasks, debouncedSearchQuery]);

  const handleDelete = async (id: string) => {
    const taskToDelete = tasks.find(task => task.id === id);
    if (taskToDelete) {
      onDelete(id);
    }
  };

  const handleStatusChange = (id: string, status: Task['status']) => {
    onStatusChange(id, status);
    // Removed toggle feedback toast
  };

  if (isLoading) {
    return (
      <div className="task-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {/* Search and Sort Controls */}
      <div className="task-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="sort-container">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      {/* Tab Filters with Counts */}
      <div className="task-filters">
        <button 
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => onFilterChange('all')}
        >
          All ({tabCounts.all})
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'pending' ? 'active' : ''}`}
          onClick={() => onFilterChange('pending')}
        >
          Pending ({tabCounts.pending})
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'completed' ? 'active' : ''}`}
          onClick={() => onFilterChange('completed')}
        >
          Completed ({tabCounts.completed})
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'high' ? 'active' : ''}`}
          onClick={() => onFilterChange('high')}
        >
          High Priority ({tabCounts.high})
        </button>
      </div>

      {/* Tasks */}
      <div className="tasks-container">
        {processedTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>
              {debouncedSearchQuery ? 'No matching tasks' : 
               activeFilter === 'completed' ? 'No completed tasks' :
               activeFilter === 'pending' ? 'No pending tasks' :
               activeFilter === 'high' ? 'No high priority tasks' :
               'No tasks yet'}
            </h3>
            <p>
              {debouncedSearchQuery ? 'Try adjusting your search terms' :
               'Create your first task to get started!'}
            </p>
            {!debouncedSearchQuery && (
              <button 
                className="add-task-cta"
                onClick={() => onFilterChange('all')}
              >
                Add a task
              </button>
            )}
          </div>
        ) : (
          processedTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;
