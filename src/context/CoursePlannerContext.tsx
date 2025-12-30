import React, { createContext, useContext, useReducer, useEffect, ReactNode, useRef, useMemo, useCallback } from 'react';
import { Course, AppState, PaletteConfig } from '../types/course';
import { defaultData } from '../data/defaultData';
import { optData } from '../data/optData';

const PALETTES: Record<string, PaletteConfig> = {
  'soft-pastel': {
    id: 'soft-pastel',
    name: 'Soft Pastels',
    colors: {
      dcc: '#a78bfa',
      fmat: '#f472b6',
      major: '#7c3aed',
      ofg: '#fb7185',
      eti: '#fb923c',
      opt: '#38bdf8',
      optcomp: '#8b5cf6',
      'opt-cien': '#22c55e',
      'opt-mat': '#e879f9',
      optlet: '#f87171',
      econ: '#ec4899',
      'opt-ast': '#818cf8',
      optbio: '#34d399',
      optcom: '#fbbf24',
    }
  },
  'original': {
    id: 'original',
    name: 'Original',
    colors: {
      dcc: 'linear-gradient(135deg, #1D7AFC 0%, #0056d3 100%)',
      fmat: 'linear-gradient(135deg, #DA62AC 0%, #c4498a 100%)',
      major: 'linear-gradient(135deg, #0055CC 0%, #0044a3 100%)',
      ofg: 'linear-gradient(135deg, #F15B50 0%, #e03e32 100%)',
      eti: 'linear-gradient(135deg, #2898BD 0%, #1f7a9a 100%)',
      opt: 'linear-gradient(135deg, #6E5DC6 0%, #5a4ba3 100%)',
      optcomp: 'linear-gradient(135deg, #1686d6 0%, #1270b3 100%)',
      'opt-cien': 'linear-gradient(135deg, #1F845A 0%, #196b47 100%)',
      'opt-mat': 'linear-gradient(135deg, #DA62AC 0%, #c4498a 100%)',
      optlet: 'linear-gradient(135deg, #E56910 0%, #cc5500 100%)',
      econ: 'linear-gradient(135deg, #9543c5 0%, #7a359e 100%)',
      'opt-ast': 'linear-gradient(135deg, #130947 0%, #0a0530 100%)',
      optbio: 'linear-gradient(135deg, #164B35 0%, #0f3226 100%)',
      optcom: 'linear-gradient(135deg, #5E4DB2 0%, #4a3d8f 100%)'
    }
  }
};

interface CoursePlannerContextType {
  state: AppState;
  dispatch: React.Dispatch<CoursePlannerAction>;
  allCourses: Course[];
  findCourseData: (courseId: string) => Course | undefined;
  getCurrentPalette: () => PaletteConfig;
  getAvailablePalettes: () => PaletteConfig[];
}

type CoursePlannerAction =
  | { type: 'MOVE_COURSE'; payload: { courseId: string; fromContainer: string; toContainer: string; toIndex?: number } }
  | { type: 'TOGGLE_COURSE_TAKEN'; payload: { courseId: string } }
  | { type: 'ADD_SEMESTER' }
  | { type: 'DELETE_SEMESTER'; payload: { semesterNumber: number } }
  | { type: 'RESET_PLANNER' }
  | { type: 'TOGGLE_COURSE_POOL' }
  | { type: 'CREATE_CUSTOM_COURSE'; payload: Course }
  | { type: 'UPDATE_COURSE'; payload: { originalId: string; course: Course } }
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'SET_PALETTE'; payload: { paletteId: string } };

const CoursePlannerContext = createContext<CoursePlannerContextType | undefined>(undefined);

const STORAGE_KEY = 'coursePlannerState';
const DATA_VERSION = 1;

const initialState: AppState = {
  semesters: [],
  coursePool: [],
  customCourses: [],
  modifiedCourses: {},
  semesterCount: 8,
  coursePoolVisible: false,
  currentPalette: 'soft-pastel',
  version: DATA_VERSION
};

function findNextAvailableSemesterNumber(semesters: { number: number; courses: any[] }[]): number {
  const existingNumbers = semesters.map(sem => sem.number).sort((a, b) => a - b);
  
  for (let i = 1; i <= existingNumbers.length + 1; i++) {
    if (!existingNumbers.includes(i)) {
      return i;
    }
  }
  
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

    case 'UPDATE_COURSE': {
      const { originalId, course } = action.payload;
      return {
        ...state,
        modifiedCourses: {
          ...state.modifiedCourses,
          [originalId]: course
        }
      };
    }
    
    case 'LOAD_STATE': {
      return action.payload;
    }
    
    case 'SET_PALETTE': {
      return {
        ...state,
        currentPalette: action.payload.paletteId
      };
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
    modifiedCourses: {},
    semesterCount: 8,
    coursePoolVisible: false,
    currentPalette: 'soft-pastel',
    version: DATA_VERSION
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
      if (parsedState.version !== DATA_VERSION) {
        console.warn('State version mismatch (expected ' + DATA_VERSION + '), resetting state to apply updates.');
        return null;
      }
      
      if (!parsedState.currentPalette) {
        parsedState.currentPalette = 'soft-pastel';
      }
      if (!parsedState.modifiedCourses) {
        parsedState.modifiedCourses = {};
      }
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
    (_initial) => {
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
    if (state.modifiedCourses[courseId]) {
      return state.modifiedCourses[courseId];
    }
    return allCourses.find(course => course.id === courseId);
  }, [allCourses, state.modifiedCourses]);

  const getCurrentPalette = useCallback((): PaletteConfig => {
    return PALETTES[state.currentPalette] || PALETTES['soft-pastel'];
  }, [state.currentPalette]);

  const getAvailablePalettes = useCallback((): PaletteConfig[] => {
    return Object.values(PALETTES);
  }, []);
  
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
    findCourseData,
    getCurrentPalette,
    getAvailablePalettes
  }), [state, allCourses, findCourseData, getCurrentPalette, getAvailablePalettes]);
  
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