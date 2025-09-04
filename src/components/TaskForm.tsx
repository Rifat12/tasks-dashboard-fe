import React, { useState, useRef, useEffect } from 'react';
import type { TaskInput } from '../types/task';
import { getLocal, setLocal } from '../utils/storage';
import './TaskForm.css';

interface TaskFormProps {
  onSubmit: (task: TaskInput) => void;
  isLoading?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState<TaskInput>({
    title: '',
    description: '',
    priority: getLocal('lastPriority', 'low' as TaskInput['priority']),
  });
  
  const [validationError, setValidationError] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      const scrollHeight = Math.min(textarea.scrollHeight, 6 * 24); // Max 6 lines
      textarea.style.height = `${Math.max(scrollHeight, 2 * 24)}px`; // Min 2 lines
    }
  }, [formData.description]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = formData.title.trim();
    
    if (!title) {
      setValidationError('Title is required');
      titleInputRef.current?.focus();
      return;
    }
    
    setValidationError('');
    
    // Remember last priority
    setLocal('lastPriority', formData.priority);
    
    onSubmit({
      ...formData,
      title,
      description: formData.description?.trim() || undefined,
    });
    
    // Reset form and focus title for rapid entry
    setFormData({
      title: '',
      description: '',
      priority: formData.priority, // Keep last priority
    });
    
    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 100);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'title' && validationError) {
      setValidationError('');
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.ctrlKey || e.metaKey) {
        // Cmd/Ctrl+Enter submits
        e.preventDefault();
        handleSubmit(e as any);
      } else if (e.target === titleInputRef.current) {
        // Enter in title field submits
        e.preventDefault();
        handleSubmit(e as any);
      }
    }
  };

  const isFormValid = formData.title.trim().length > 0;

  return (
    <div className="task-form-container">
      <h2>Add New Task</h2>
      
      <form onSubmit={handleSubmit} className="task-form" onKeyDown={handleKeyDown}>
        <div className="form-group">
          <label htmlFor="title">Task Title</label>
          <input
            ref={titleInputRef}
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title..."
            disabled={isLoading}
            className={validationError ? 'error' : ''}
          />
          {validationError && (
            <div className="validation-error">{validationError}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            ref={textareaRef}
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Task details..."
            disabled={isLoading}
            style={{ minHeight: '48px', maxHeight: '144px', resize: 'none' }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            disabled={isLoading}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={!isFormValid || isLoading} 
          className="submit-button"
        >
          {isLoading ? 'Adding...' : 'Add Task'}
        </button>
        

      </form>
    </div>
  );
};

export default TaskForm;
