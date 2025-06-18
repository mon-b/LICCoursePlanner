import React, { createContext, useContext, useReducer, useEffect, ReactNode, useRef, useMemo, useCallback } from 'react';
import { Course, AppState } from '../types/course';
import { defaultData } from '../data/defaultData';
import { optData } from '../data/optData';

interface CoursePlannerContextType {
  state: AppState;
  dispatch: React.Dispatch<CoursePlannerAction>;
  allCourses: Course[];
  findCourseData: (courseId: string) => Course | undefined;
}

type CoursePlannerAction =
  | { type: 'MOVE_COURSE'; payload: { courseId: string; fromContainer: string; toContainer: string; toIndex?: number } }
  | { type: 'TOGGLE_COURSE_TAKEN'; payload: { courseId: string } }
  | { type: 'ADD_SEMESTER' }
  | { type: 'DELETE_SEMESTER'; payload: { semesterNumber: number } }
  | { type: 'RESET_PLANNER' }
  | { type: 'TOGGLE_COURSE_POOL' }
  | { type: 'CREATE_CUSTOM_COURSE'; payload: Course }
  | { type: 'LOAD_STATE'; payload: AppState };

const CoursePlannerContext = createContext<CoursePlannerContextType | undefined>(undefined);

const STORAGE_KEY = 'coursePlannerState';

const initialState: AppState = {
  semesters: [],
  coursePool: [],
  customCourses: [],
  semesterCount: 8,
  coursePoolVisible: false
};

function findNextAvailableSemesterNumber(semesters: { number: number; courses: any[] }[]): number {
  const existingNumbers = semesters.map(sem => sem.number).sort((a, b) => a - b);
  
  for (let i = 1; i <= existingNumbers.length + 1; i++) {
    if (!existingNumbers.includes(i)) {
      return i;
    }
  }
  
  // If no gaps, return the next number after the highest
  return Math.max(...existingNumbers, 0) + 1;
}

function coursePlannerReducer(state: AppState, action: CoursePlannerAction): AppState {
  switch (action.type) {
    case 'MOVE_COURSE': {
      const { courseId, toContainer, toIndex } = action.payload;
      
      let newSemesters = state.semesters.map(sem => ({
        ...sem,
        courses: sem.courses.filter(c => c.id !== courseId)
      }));
      
      let newCoursePool = state.coursePool.filter(c => c.id !== courseId);
      
      if (toContainer === 'course-pool') {
        const courseState = findCourseState(courseId, state);
        if (courseState) {
          newCoursePool.push(courseState);
        }
      } else if (toContainer.startsWith('sem')) {
        const semesterNumber = parseInt(toContainer.replace('sem', ''));
        const courseState = findCourseState(courseId, state);
        if (courseState) {
          newSemesters = newSemesters.map(sem => {
            if (sem.number === semesterNumber) {
              const newCourses = [...sem.courses];
              if (toIndex !== undefined) {
                newCourses.splice(toIndex, 0, courseState);
              } else {
                newCourses.push(courseState);
              }
              return { ...sem, courses: newCourses };
            }
            return sem;
          });
        }
      }
      
      return {
        ...state,
        semesters: newSemesters,
        coursePool: newCoursePool
      };
    }
    
    case 'TOGGLE_COURSE_TAKEN': {
      const { courseId } = action.payload;
      
      return {
        ...state,
        semesters: state.semesters.map(sem => ({
          ...sem,
          courses: sem.courses.map(course => 
            course.id === courseId ? { ...course, taken: !course.taken } : course
          )
        })),
        coursePool: state.coursePool.map(course => 
          course.id === courseId ? { ...course, taken: !course.taken } : course
        )
      };
    }
    
    case 'ADD_SEMESTER': {
        const newSemesterNumber = findNextAvailableSemesterNumber(state.semesters);
        return {
            ...state,
            semesters: [
            ...state.semesters,
            { number: newSemesterNumber, courses: [] }
            ],
            semesterCount: Math.max(state.semesterCount, newSemesterNumber)
        };
    }
    
    case 'DELETE_SEMESTER': {
      const { semesterNumber } = action.payload;
      const semesterToDelete = state.semesters.find(s => s.number === semesterNumber);
      
      return {
        ...state,
        semesters: state.semesters.filter(s => s.number !== semesterNumber),
        coursePool: semesterToDelete 
          ? [...state.coursePool, ...semesterToDelete.courses]
          : state.coursePool
      };
    }
    
    case 'RESET_PLANNER': {
      return initializeDefaultState();
    }
    
    case 'TOGGLE_COURSE_POOL': {
      return {
        ...state,
        coursePoolVisible: !state.coursePoolVisible
      };
    }
    
    case 'CREATE_CUSTOM_COURSE': {
      const newCourse = action.payload;
      return {
        ...state,
        customCourses: [...state.customCourses, newCourse],
        coursePool: [
          ...state.coursePool,
          { id: newCourse.id, type: newCourse.type, taken: false }
        ]
      };
    }
    
    case 'LOAD_STATE': {
      return action.payload;
    }
    
    default:
      return state;
  }
}

function findCourseState(courseId: string, state: AppState) {
  for (const semester of state.semesters) {
    const course = semester.courses.find(c => c.id === courseId);
    if (course) return course;
  }
  
  return state.coursePool.find(c => c.id === courseId);
}

function initializeDefaultState(): AppState {
  const semesters = defaultData.map(sem => ({
    number: sem.sem,
    courses: sem.courses.map(course => ({
      id: course.id,
      type: course.type,
      taken: false
    }))
  }));
  
  const coursePool = optData[0].courses.map(course => ({
    id: course.id,
    type: course.type,
    taken: false
  }));
  
  return {
    semesters,
    coursePool,
    customCourses: [],
    semesterCount: 8,
    coursePoolVisible: false
  };
}

function loadStateFromStorage(): AppState | null {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (!savedState) return null;
    
    const parsedState = JSON.parse(savedState);
    
    if (
      parsedState &&
      typeof parsedState === 'object' &&
      Array.isArray(parsedState.semesters) &&
      Array.isArray(parsedState.coursePool) &&
      Array.isArray(parsedState.customCourses) &&
      typeof parsedState.semesterCount === 'number' &&
      typeof parsedState.coursePoolVisible === 'boolean'
    ) {
      return parsedState;
    }
    
    console.warn('Invalid state structure in localStorage, using default state');
    return null;
  } catch (error) {
    console.error('Failed to load saved state:', error);
    return null;
  }
}

function saveStateToStorage(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
}

export function CoursePlannerProvider({ children }: { children: ReactNode }) {
  const hasLoadedFromStorage = useRef(false);
  
  const [state, dispatch] = useReducer(
    coursePlannerReducer, 
    initialState, 
    (initial) => {
      const savedState = loadStateFromStorage();
      if (savedState) {
        hasLoadedFromStorage.current = true;
        return savedState;
      }
      return initializeDefaultState();
    }
  );
  
  const allCourses = useMemo((): Course[] => {
    return [
      ...defaultData.flatMap(sem => sem.courses),
      ...optData[0].courses,
      ...state.customCourses
    ];
  }, [state.customCourses]);
  
  const findCourseData = useCallback((courseId: string): Course | undefined => {
    return allCourses.find(course => course.id === courseId);
  }, [allCourses]);
  
  useEffect(() => {
    if (hasLoadedFromStorage.current) {
      saveStateToStorage(state);
    } else {
      hasLoadedFromStorage.current = true;
    }
  }, [state]);
  
  const value = useMemo(() => ({
    state,
    dispatch,
    allCourses,
    findCourseData
  }), [state, allCourses, findCourseData]);
  
  return (
    <CoursePlannerContext.Provider value={value}>
      {children}
    </CoursePlannerContext.Provider>
  );
}

export function useCoursePlanner() {
  const context = useContext(CoursePlannerContext);
  if (context === undefined) {
    throw new Error('useCoursePlanner must be used within a CoursePlannerProvider');
  }
  return context;
}