# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Task Management Frontend

A modern React TypeScript frontend for the Task Management API built with Vite.

## Features

- ✅ **Create Tasks**: Add new tasks with title, description, and initial status
- 📝 **Task Management**: View all tasks in a clean, organized interface
- 🔄 **Status Updates**: Change task status between Pending, In Progress, and Completed
- 🗑️ **Delete Tasks**: Remove tasks with confirmation
- 📊 **Task Statistics**: View task counts by status
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Real-time Updates**: Instant UI updates when tasks are modified

## Tech Stack

- **React 19** with TypeScript
- **Vite** for development and building
- **Axios** for API communication
- **CSS3** with modern styling and animations
- **ESLint** for code quality

## Prerequisites

Make sure you have the following running:

1. **Backend API** - The Task Management API should be running on `http://localhost:3000`
   - API documentation available at: `http://localhost:3000/api-docs/`
2. **Node.js** (version 16 or higher)
3. **npm** or **yarn**

## Installation

1. Clone/navigate to the project directory:
   ```bash
   cd tasksfront
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit: `http://localhost:5173/`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The frontend integrates with the following API endpoints:

- `GET /api/tasks` - Fetch all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/{id}` - Get specific task
- `PUT /api/tasks/{id}/status` - Update task status
- `DELETE /api/tasks/{id}` - Delete a task
- `GET /health` - Health check

## Project Structure

```
src/
├── components/          # React components
│   ├── TaskCard.tsx    # Individual task display
│   ├── TaskForm.tsx    # Task creation form
│   ├── TaskList.tsx    # Task list with statistics
│   └── *.css           # Component styles
├── hooks/              # Custom React hooks
│   └── useTasks.ts     # Task management logic
├── services/           # API services
│   └── api.ts          # Axios API client
├── types/              # TypeScript type definitions
│   └── task.ts         # Task-related types
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Usage

### Creating a Task
1. Fill in the task title (required)
2. Optionally add a description
3. Select initial status (defaults to Pending)
4. Click "Create Task"

### Managing Tasks
- **Change Status**: Use the dropdown on each task card
- **Delete Task**: Click the trash icon (requires confirmation)
- **View Statistics**: Check the stats bar above the task list

### Task Statuses
- **Pending**: ⏳ Tasks that haven't been started
- **In Progress**: 🔄 Tasks currently being worked on  
- **Completed**: ✅ Finished tasks

## Features in Detail

### Task Statistics
The dashboard shows:
- Number of pending tasks
- Number of in-progress tasks  
- Number of completed tasks
- Total task count

### Responsive Design
- Desktop: Full-width layout with optimal spacing
- Mobile: Stacked layout with touch-friendly controls

### Error Handling
- Network errors are displayed with retry options
- Form validation prevents empty task creation
- Loading states provide user feedback

## Configuration

The API base URL is configured in `src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:3000';
```

Update this if your backend runs on a different port or domain.

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## Troubleshooting

### Common Issues

1. **Cannot connect to API**
   - Ensure the backend is running on `http://localhost:3000`
   - Check if CORS is properly configured on the backend

2. **Tasks not loading**
   - Verify the API endpoints are working via `http://localhost:3000/api-docs/`
   - Check browser console for error messages

3. **Build errors**
   - Run `npm run lint` to check for code issues
   - Ensure all dependencies are installed with `npm install`

## Contributing

1. Follow the existing code style
2. Run `npm run lint` before committing
3. Test all functionality before submitting changes
4. Update this README if adding new features

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
