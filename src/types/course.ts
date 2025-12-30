export type CourseType = 
  | 'dcc' 
  | 'fmat' 
  | 'major' 
  | 'ofg' 
  | 'eti' 
  | 'opt' 
  | 'optcomp' 
  | 'opt-cien' 
  | 'opt-mat' 
  | 'optlet' 
  | 'econ' 
  | 'opt-ast' 
  | 'optbio' 
  | 'optcom'
  | 'engdiag'
  | 'engcour';

export type CourseParity = 'even' | 'odd' | 'both' | null;

export interface Course {
  id: string;
  name: string;
  name_english: string;
  name_stylized: string;
  prereq: string | null;
  cred: string;
  type: CourseType;
  parity: CourseParity;
  hide?: boolean;
  number?: number;
  taken?: boolean;
}

export interface Semester {
  sem: number;
  courses: Course[];
}

export interface CourseState {
  id: string;
  type: CourseType;
  taken: boolean;
}

export interface SemesterState {
  number: number;
  courses: CourseState[];
}
export interface PaletteConfig {
  id: string;
  name: string;
  colors: {
    dcc: string;
    fmat: string;
    major: string;
    ofg: string;
    eti: string;
    opt: string;
    optcomp: string;
    'opt-cien': string;
    'opt-mat': string;
    optlet: string;
    econ: string;
    'opt-ast': string;
    optbio: string;
    optcom: string;
    engdiag: string;
    engcour: string;
  };
}

export interface AppState {
  semesters: SemesterState[];
  coursePool: CourseState[];
  customCourses: Course[];
  modifiedCourses: Record<string, Course>;
  semesterCount: number;
  coursePoolVisible: boolean;
  currentPalette: string;
}