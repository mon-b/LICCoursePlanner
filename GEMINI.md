# LICCoursePlanner

## Project Overview

**LICCoursePlanner** is a React-based web application designed to help Computer Science students at UC Chile plan their academic path. It provides an interactive interface to organize courses across semesters, track progress, and visualize prerequisites.

### Key Features
*   **Interactive Planning:** Drag-and-drop interface for moving courses between semesters.
*   **Prerequisite Visualization:** Visual cues for course dependencies.
*   **Progress Tracking:** Mark courses as "taken" or "completed".
*   **Customization:** Support for custom courses and multiple color palettes.
*   **Bilingual:** Full English and Spanish support via `i18next`.
*   **Persistence:** Auto-saves planning state to local storage.

## Tech Stack & Architecture

*   **Framework:** React 18 + TypeScript
*   **Build Tool:** Vite
*   **Routing:** React Router v6 (configured with `basename="/LICCoursePlanner"`)
*   **State Management:** React Context API + `useReducer`. State is persisted in `localStorage`.
*   **Styling:** CSS Modules (`*.module.css`) for component-level styling, plus global CSS.
*   **Internationalization:** `react-i18next`
*   **Deployment:** GitHub Pages (via `gh-pages`)

## Project Structure

```
src/
├── components/          # Reusable UI components (Course, Semester, etc.)
│   └── ComponentName/   # Co-located component logic (.tsx) and styles (.module.css)
├── pages/               # Page-level components (HomePage, PlannerPage)
├── context/             # CoursePlannerContext (State management logic)
├── data/                # Static course data (defaultData.ts, optData.ts)
├── i18n/                # Internationalization configuration
├── types/               # TypeScript interfaces (Course, Semester, AppState)
├── utils/               # Helper functions (validation, pathfinding)
├── App.tsx              # Application root & Routing setup
└── main.tsx             # Entry point
```

## Development Workflow

### Prerequisites
*   Node.js (v16+ recommended)
*   npm

### Key Commands

| Command | Description |
| :--- | :--- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the development server (usually at `http://localhost:5173`) |
| `npm run build` | Build the project for production |
| `npm run preview` | Preview the production build locally |
| `npm run deploy` | Deploy the `dist` folder to GitHub Pages |

### Data Management
*   **Course Definitions:** Core course data is located in `src/data/`. `defaultData.ts` contains the standard curriculum, while `optData.ts` contains elective courses.
*   **State:** The application state (`semesters`, `coursePool`, `customCourses`) is managed in `CoursePlannerContext.tsx`.

## Contribution Guidelines
*   **Conventions:** Follow existing code style. Use Functional Components with Hooks.
*   **Styling:** Prefer CSS Modules for new components to avoid namespace collisions.
*   **Types:** Ensure strict typing using the interfaces defined in `src/types/`.
*   **Commits:** Write clear commit messages explaining *why* a change was made.
