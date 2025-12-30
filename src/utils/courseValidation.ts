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
  
  return evaluatePrerequisiteRecursive(
    course.prereq, 
    targetSemesterNumber, 
    state, 
    findCourseData, 
    checkedCourses
  );
}

function evaluatePrerequisiteRecursive(
  expression: string,
  targetSemesterNumber: number,
  state: AppState,
  findCourseData: (id: string) => Course | undefined,
  checkedCourses: Set<string>
): boolean {
  const trimmed = expression.trim();
  if (!trimmed) return true;

  if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
     const inner = trimmed.substring(1, trimmed.length - 1);
     let depth = 0;
     let isWrapped = true;
     for(let i=0; i<trimmed.length; i++) {
        if(trimmed[i] === '(') depth++;
        else if(trimmed[i] === ')') depth--;
        if (depth === 0 && i < trimmed.length - 1) {
            isWrapped = false;
            break;
        }
     }
     if (isWrapped) {
         return evaluatePrerequisiteRecursive(inner, targetSemesterNumber, state, findCourseData, checkedCourses);
     }
  }

  const orParts = splitTopLevel(trimmed, ' o ');
  if (orParts.length > 1) {
    return orParts.some(part => 
        evaluatePrerequisiteRecursive(part, targetSemesterNumber, state, findCourseData, checkedCourses)
    );
  }

  const andParts = splitTopLevel(trimmed, ' y ');
  if (andParts.length > 1) {
    return andParts.every(part => 
        evaluatePrerequisiteRecursive(part, targetSemesterNumber, state, findCourseData, checkedCourses)
    );
  }

  const creditsMatch = trimmed.match(/créditos\s*>=\s*(\d+)/i);
  if (creditsMatch) {
    const minCredits = parseInt(creditsMatch[1], 10);
    const totalCredits = calculateCompletedCredits(targetSemesterNumber, state, findCourseData);
    return totalCredits >= minCredits;
  }

  const isCoreq = trimmed.includes('(c)');
  const cleanId = trimmed.replace('(c)', '').trim();
  
  if (!/^[A-Z]{3,}/.test(cleanId)) {
      return true; 
  }

  const inPrevious = isInPreviousSemester(cleanId, targetSemesterNumber, state, findCourseData);
  
  if (inPrevious) {
      return true;
  }
  
  if (isCoreq) {
      const inSame = isInSameSemester(cleanId, targetSemesterNumber, state, findCourseData);
      if (inSame) return true;
  }

  return false;
}

function splitTopLevel(text: string, separator: string): string[] {
  const result: string[] = [];
  let current = '';
  let depth = 0;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    if (char === '(') depth++;
    else if (char === ')') depth--;
    
    if (depth === 0 && text.substring(i, i + separator.length) === separator) {
      result.push(current);
      current = '';
      i += separator.length - 1;
    } else {
      current += char;
    }
  }
  
  if (current) result.push(current);
  return result;
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