import { Course, AppState, CourseParity } from '../types/course';

export function isParityValid(course: Course, semesterNumber: number): boolean {
  const parity = course.parity;
  if (!parity || parity === 'both') return true;
  
  const isEvenSemester = semesterNumber % 2 === 0;
  if (parity === 'even' && !isEvenSemester) return false;
  if (parity === 'odd' && isEvenSemester) return false;
  
  return true;
}

export function validatePrerequisites(
  courseId: string,
  targetSemesterNumber: number,
  state: AppState,
  findCourseData: (id: string) => Course | undefined,
  checkedCourses = new Set<string>()
): boolean {
  if (checkedCourses.has(courseId)) {
    return true;
  }
  checkedCourses.add(courseId);
  
  const course = findCourseData(courseId);
  if (!course || !course.prereq) {
    return true;
  }
  
  const prereqGroups = parsePrerequisites(course.prereq);
  
  for (const orGroup of prereqGroups) {
    const orGroupSatisfied = orGroup.some(prereq => {
      if (prereq.isCoreq) {
        return isInPreviousSemester(prereq.id, targetSemesterNumber, state) ||
               isInSameSemester(prereq.id, targetSemesterNumber, state);
      } else {
        return isInPreviousSemester(prereq.id, targetSemesterNumber, state) &&
               validatePrerequisites(prereq.id, targetSemesterNumber, state, findCourseData, checkedCourses);
      }
    });
    
    if (!orGroupSatisfied) {
      return false;
    }
  }
  
  return true;
}

interface PrerequisiteItem {
  id: string;
  isCoreq: boolean;
}

function parsePrerequisites(prereqString: string): PrerequisiteItem[][] {
  if (!prereqString) return [];
  
  const andGroups = prereqString.split(' y ');
  
  const groups = andGroups.map(group => {
    const orGroup = group.split(' o ');
    return orGroup.map(course => {
      const coreqMatch = course.match(/([A-Z]+\d+)\(c\)/);
      if (coreqMatch) {
        return {
          id: coreqMatch[1],
          isCoreq: true
        };
      }
      
      const normalMatch = course.match(/([A-Z]+\d+)/);
      if (normalMatch) {
        return {
          id: normalMatch[1],
          isCoreq: false
        };
      }
      
      return null;
    }).filter((item): item is PrerequisiteItem => item !== null);
  });
  
  return groups;
}

function isInPreviousSemester(courseId: string, targetSemesterNumber: number, state: AppState): boolean {
  for (const semester of state.semesters) {
    if (semester.number < targetSemesterNumber) {
      if (semester.courses.some(c => c.id === courseId)) {
        return true;
      }
    }
  }
  return false;
}

function isInSameSemester(courseId: string, targetSemesterNumber: number, state: AppState): boolean {
  const targetSemester = state.semesters.find(s => s.number === targetSemesterNumber);
  if (!targetSemester) return false;
  
  return targetSemester.courses.some(c => c.id === courseId);
}