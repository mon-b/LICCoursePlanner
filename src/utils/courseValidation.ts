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
      if (prereq.type === 'credits') {
        const totalCredits = calculateCompletedCredits(targetSemesterNumber, state, findCourseData);
        return totalCredits >= prereq.minCredits;
      }

      if (prereq.isCoreq) {
        return isInPreviousSemester(prereq.id, targetSemesterNumber, state, findCourseData) ||
               isInSameSemester(prereq.id, targetSemesterNumber, state, findCourseData);
      } else {
        return isInPreviousSemester(prereq.id, targetSemesterNumber, state, findCourseData) &&
               validatePrerequisites(prereq.id, targetSemesterNumber, state, findCourseData, checkedCourses);
      }
    });
    
    if (!orGroupSatisfied) {
      return false;
    }
  }
  
  return true;
}

type PrerequisiteItem = 
  | { type: 'course'; id: string; isCoreq: boolean }
  | { type: 'credits'; minCredits: number };

function parsePrerequisites(prereqString: string): PrerequisiteItem[][] {
  if (!prereqString) return [];
  
  const andGroups = prereqString.split(' y ');
  
  const groups = andGroups.map(group => {
    const orGroup = group.split(' o ');
    return orGroup.map(course => {
      const trimmedCourse = course.trim();

      const creditsMatch = trimmedCourse.match(/créditos\s*>=\s*(\d+)/i);
      if (creditsMatch) {
        return {
          type: 'credits',
          minCredits: parseInt(creditsMatch[1], 10)
        } as PrerequisiteItem;
      }

      const coreqMatch = trimmedCourse.match(/([A-Z]+\d+)\(c\)/);
      if (coreqMatch) {
        return {
          type: 'course',
          id: coreqMatch[1],
          isCoreq: true
        } as PrerequisiteItem;
      }
      
      const normalMatch = trimmedCourse.match(/([A-Z]+\d+)/);
      if (normalMatch) {
        return {
          type: 'course',
          id: normalMatch[1],
          isCoreq: false
        } as PrerequisiteItem;
      }
      
      return null;
    }).filter((item): item is PrerequisiteItem => item !== null);
  });
  
  return groups;
}

function calculateCompletedCredits(
  targetSemesterNumber: number,
  state: AppState,
  findCourseData: (id: string) => Course | undefined
): number {
  let total = 0;
  for (const semester of state.semesters) {
    if (semester.number < targetSemesterNumber) {
      for (const courseState of semester.courses) {
        const course = findCourseData(courseState.id);
        if (course && course.cred) {
          total += parseInt(course.cred, 10) || 0;
        }
      }
    }
  }
  return total;
}

function isInPreviousSemester(targetCourseId: string, targetSemesterNumber: number, state: AppState, findCourseData: (id: string) => Course | undefined): boolean {
  for (const semester of state.semesters) {
    if (semester.number < targetSemesterNumber) {
      for (const courseState of semester.courses) {
        const courseData = findCourseData(courseState.id);
        const resolvedId = courseData ? courseData.id : courseState.id;
        if (resolvedId === targetCourseId) {
          return true;
        }
      }
    }
  }
  return false;
}

function isInSameSemester(targetCourseId: string, targetSemesterNumber: number, state: AppState, findCourseData: (id: string) => Course | undefined): boolean {
  const targetSemester = state.semesters.find(s => s.number === targetSemesterNumber);
  if (!targetSemester) return false;
  
  for (const courseState of targetSemester.courses) {
    const courseData = findCourseData(courseState.id);
    const resolvedId = courseData ? courseData.id : courseState.id;
    if (resolvedId === targetCourseId) {
      return true;
    }
  }
  return false;
}
