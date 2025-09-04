import React from 'react';
import type { Task } from '../types/task';
import { formatRelative, formatFullDate } from '../utils/time';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: Task['status']) => void;
  onDelete: (id: string) => void;
  onEdit?: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange, onDelete, onEdit }) => {
  const getPriorityClass = (priority: Task['priority']) => {
    return `task--${priority}`;
  };

  const getPriorityLabel = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'HIGH';
      case 'medium':
        return 'MEDIUM';
      case 'low':
        return 'LOW';
      default:
        return 'LOW';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#9ca3af';
      default:
        return '#9ca3af';
    }
  };

  const handleRowClick = () => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    onStatusChange(task.id, newStatus);
  };

  const handleCheckboxChange = () => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    onStatusChange(task.id, newStatus);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(task);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  const relativeTime = formatRelative(task.createdAt);
  const fullDate = formatFullDate(task.createdAt);

  return (
    <div 
      className={`task ${getPriorityClass(task.priority)} ${task.status === 'completed' ? 'task--completed' : ''}`}
      onClick={handleRowClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleRowClick();
        }
      }}
    >
      <div className="task__main">
        <div className="task__checkbox-container">
          <input
            type="checkbox"
            checked={task.status === 'completed'}
            onChange={handleCheckboxChange}
            onClick={(e) => e.stopPropagation()}
            className="task__checkbox"
            aria-label={`Mark "${task.title}" as ${task.status === 'completed' ? 'incomplete' : 'complete'}`}
          />
        </div>
        
        <div className="task__content">
          <div className="task__header">
            <h3 className="task__title">{task.title}</h3>
            <span 
              className="task__priority-badge"
              style={{ backgroundColor: getPriorityColor(task.priority) }}
            >
              {getPriorityLabel(task.priority)}
            </span>
          </div>
          
          {task.description && (
            <p className="task__desc">{task.description}</p>
          )}
          
          <div className="task__meta" title={fullDate}>
            {relativeTime}
          </div>
        </div>
        
        <div className="task__actions">
          {onEdit && (
            <button
              className="icon-btn task__edit"
              onClick={handleEditClick}
              aria-label={`Edit task "${task.title}"`}
              title="Edit task"
            >
              ✏️
            </button>
          )}
          <button
            className="icon-btn task__delete"
            onClick={handleDeleteClick}
            aria-label={`Delete task "${task.title}"`}
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
