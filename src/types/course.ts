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
  | 'optcom';

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

export interface AppState {
  semesters: SemesterState[];
  coursePool: CourseState[];
  customCourses: Course[];
  semesterCount: number;
  coursePoolVisible: boolean;
}