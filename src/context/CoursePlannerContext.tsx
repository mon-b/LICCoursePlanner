import React, { createContext, useContext, useReducer, useEffect, ReactNode, useRef, useMemo, useCallback, useState } from 'react';
import { Course, AppState, PaletteConfig } from '../types/course';
import { defaultData } from '../data/defaultData';
import { optData } from '../data/optData';
import { engData } from '../data/engData';

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
      engdiag: '#eab308',
      engcour: '#d97706',
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
      optcom: 'linear-gradient(135deg, #5E4DB2 0%, #4a3d8f 100%)',
      'engdiag': 'linear-gradient(135deg, #FFD700 0%, #FDB931 100%)',
      'engcour': 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
    }
  }
};

// Define available generations
export const GENERATIONS = [
  { id: 'genLegacy', name: 'Malla 2023-2024' },
  { id: 'genNew', name: 'Malla 2025' }
];

interface CoursePlannerContextType {
  state: AppState;
  dispatch: React.Dispatch<CoursePlannerAction>;
  allCourses: Course[];
  findCourseData: (courseId: string) => Course | undefined;
  getCurrentPalette: () => PaletteConfig;
  getAvailablePalettes: () => PaletteConfig[];
  currentGeneration: string;
  switchGeneration: (genId: string) => void;
}

type CoursePlannerAction =
  | { type: 'MOVE_COURSE'; payload: { courseId: string; fromContainer: string; toContainer: string; toIndex?: number } }
  | { type: 'TOGGLE_COURSE_TAKEN'; payload: { courseId: string } }
  | { type: 'ADD_SEMESTER' }
  | { type: 'DELETE_SEMESTER'; payload: { semesterNumber: number } }
  | { type: 'RESET_PLANNER'; payload: { genId: string } }
  | { type: 'TOGGLE_COURSE_POOL' }
  | { type: 'CREATE_CUSTOM_COURSE'; payload: Course }
  | { type: 'UPDATE_COURSE'; payload: { originalId: string; course: Course } }
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'SET_PALETTE'; payload: { paletteId: string } };

const CoursePlannerContext = createContext<CoursePlannerContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'coursePlannerState';
const CURRENT_GEN_KEY = 'coursePlannerCurrentGen';
const DATA_VERSION = 3;

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
      return initializeDefaultState(action.payload.genId);
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

function initializeDefaultState(genId: string = 'genLegacy'): AppState {
  let semestersData = JSON.parse(JSON.stringify(defaultData));

  semestersData.forEach((sem: any) => {
    const practice = sem.courses.find((c: any) => c.id === 'IIC2002');
    if (practice) {
      practice.cred = "10";
    }
  });

  if (genId === 'genNew') {
    const courseMoves = [
      { id: 'IIC2343', toSem: 4 },
      { id: 'IIC2333', toSem: 5 },
      { id: 'OPTC1',   toSem: 2 }
    ];

    const extractCourse = (id: string) => {
      for (const sem of semestersData) {
        const idx = sem.courses.findIndex((c: any) => c.id === id);
        if (idx !== -1) {
          return sem.courses.splice(idx, 1)[0];
        }
      }
      return null;
    };

    const extractedCourses: Record<string, any> = {};
    courseMoves.forEach(move => {
      extractedCourses[move.id] = extractCourse(move.id);
    });

    courseMoves.forEach(move => {
      const course = extractedCourses[move.id];
      if (course) {
        const targetSem = semestersData.find((s: any) => s.sem === move.toSem);
        if (targetSem) {
          targetSem.courses.push(course);
        }
      }
    });
  }

  const typePriority: Record<string, number> = {
    'dcc': 1,
    'eti': 1,
    'major': 2,
    'opt': 3,
    'opt-cien': 3,
    'optcomp': 3,
    'optlet': 3,
    'econ': 3,
    'opt-ast': 3,
    'optbio': 3,
    'optcom': 3,
    'fmat': 4,
    'opt-mat': 4,
    'ofg': 5
  };

  const getPriority = (course: any) => {
    if (course.id === 'TEO123') return 5;
    return typePriority[course.type] || 2;
  };

  [1, 2, 3, 4, 5, 6, 7, 8].forEach(semNum => {
    const targetSem = semestersData.find((s: any) => s.sem === semNum);
    if (targetSem) {
      targetSem.courses.sort((a: any, b: any) => getPriority(a) - getPriority(b));
    }
  });

  const semesters = semestersData.map((sem: any) => ({
    number: sem.sem,
    courses: sem.courses.map((course: any) => ({
      id: course.id,
      type: course.type,
      taken: false
    }))
  }));
  
  const coursePool = [
    ...optData[0].courses,
    ...engData[0].courses
  ].map(course => ({
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

function getStorageKey(genId: string) {
  if (genId === 'genLegacy') return STORAGE_KEY_PREFIX;
  return `${STORAGE_KEY_PREFIX}_${genId}`;
}

function loadStateFromStorage(genId: string): AppState | null {
  try {
    const key = getStorageKey(genId);
    const savedState = localStorage.getItem(key);
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
        console.warn('State version mismatch (expected ' + DATA_VERSION + '), resetting state.');
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

function saveStateToStorage(state: AppState, genId: string): void {
  try {
    const key = getStorageKey(genId);
    localStorage.setItem(key, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
}

export function CoursePlannerProvider({ children }: { children: ReactNode }) {
  const hasLoadedFromStorage = useRef(false);
  const [currentGeneration, setCurrentGeneration] = useState(() => {
     return localStorage.getItem(CURRENT_GEN_KEY) || 'genLegacy';
  });
  
  const [state, dispatch] = useReducer(
    coursePlannerReducer, 
    initialState, 
    (_initial) => {
      const initialGen = localStorage.getItem(CURRENT_GEN_KEY) || 'genLegacy';
      const savedState = loadStateFromStorage(initialGen);
      if (savedState) {
        hasLoadedFromStorage.current = true;
        return savedState;
      }
      return initializeDefaultState(initialGen);
    }
  );
  
  const allCourses = useMemo((): Course[] => {
    // Determine base data based on current generation?
    // Ideally we should reflect the changes in allCourses too if we want tooltips to be correct regarding semesters/credits?
    // However, defaultData is static.
    // For now, modifiedCourses will handle overrides if we treated them as such, but here we are moving them in semesters.
    // The "allCourses" is mainly used for palette and looking up static info. 
    // The Credits change for IIC2002 needs to be reflected here too.
    
    let baseCourses = [...defaultData.flatMap(sem => sem.courses)];
    
    if (currentGeneration === 'genNew') {
       // Update IIC2002 credits in this view as well
       baseCourses = baseCourses.map(c => {
         if (c.id === 'IIC2002') return { ...c, cred: "10" };
         return c;
       });
    }

    return [
      ...baseCourses,
      ...optData[0].courses,
      ...engData[0].courses,
      ...state.customCourses
    ];
  }, [state.customCourses, currentGeneration]);
  
  const findCourseData = useCallback((courseId: string): Course | undefined => {
    const defaultCourse = allCourses.find(course => course.id === courseId);
    const modifiedCourse = state.modifiedCourses[courseId];

    if (modifiedCourse) {
      if (defaultCourse) {
         return {
             ...modifiedCourse,
             parity: defaultCourse.parity,
             prereq: defaultCourse.prereq,
             cred: defaultCourse.cred // Ensure credit updates propagate if they are static updates
         };
      }
      return modifiedCourse;
    }
    return defaultCourse;
  }, [allCourses, state.modifiedCourses]);

  const getCurrentPalette = useCallback((): PaletteConfig => {
    return PALETTES[state.currentPalette] || PALETTES['soft-pastel'];
  }, [state.currentPalette]);

  const getAvailablePalettes = useCallback((): PaletteConfig[] => {
    return Object.values(PALETTES);
  }, []);

  const switchGeneration = useCallback((newGenId: string) => {
    if (newGenId === currentGeneration) return;

    saveStateToStorage(state, currentGeneration);

    const newState = loadStateFromStorage(newGenId) || initializeDefaultState(newGenId);
    dispatch({ type: 'LOAD_STATE', payload: newState });
    
    setCurrentGeneration(newGenId);
    localStorage.setItem(CURRENT_GEN_KEY, newGenId);
  }, [currentGeneration, state]);
  
  useEffect(() => {
    if (hasLoadedFromStorage.current) {
      saveStateToStorage(state, currentGeneration);
    } else {
      hasLoadedFromStorage.current = true;
    }
  }, [state, currentGeneration]);
  
  const value = useMemo(() => ({
    state,
    dispatch,
    allCourses,
    findCourseData,
    getCurrentPalette,
    getAvailablePalettes,
    currentGeneration,
    switchGeneration
  }), [state, allCourses, findCourseData, getCurrentPalette, getAvailablePalettes, currentGeneration, switchGeneration]);
  
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