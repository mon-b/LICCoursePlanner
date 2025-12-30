import React from 'react';
import { useTranslation } from 'react-i18next';
import { Course as CourseType, CourseState } from '../../types/course';
import { useCoursePlanner } from '../../context/CoursePlannerContext';
import styles from './Course.module.css';
import clsx from 'clsx';

interface CourseProps {
  courseState: CourseState;
  courseData?: CourseType;
  onMouseDown?: (e: React.MouseEvent, courseId: string) => void;
  onClick?: (courseId: string) => void;
  onHoverStart?: (courseId: string) => void;
  onHoverEnd?: () => void;
  onEdit?: (courseId: string) => void;
  highlightColor?: string;
}

export default function Course({
  courseState,
  courseData,
  onMouseDown,
  onClick,
  onHoverStart,
  onHoverEnd,
  onEdit,
  highlightColor
}: CourseProps) {
  const { t, i18n } = useTranslation();
  const { findCourseData, getCurrentPalette } = useCoursePlanner();
  const courseRef = React.useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showEditIcon, setShowEditIcon] = React.useState(false);

  const course = courseData || findCourseData(courseState.id);
  const currentPalette = getCurrentPalette();

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      if (onHoverStart && course?.prereq) {
        onHoverStart(courseState.id);
      }
      
      const electiveTypes = [
        'opt', 'opt-cien', 'optcomp', 'opt-mat', 'optlet', 'econ', 'optcom', 'opt-ast', 'optbio'
      ];

      if (
        (course?.type === 'ofg' && course.id !== 'FIL2001') ||
        (course?.type && electiveTypes.includes(course.type)) ||
        course?.id === 'OPTC1'
      ) {
        setShowEditIcon(true);
      }
    }, 200);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setShowEditIcon(false);
    if (onHoverEnd) {
      onHoverEnd();
    }
  };
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onEdit) {
      onEdit(courseState.id);
    }
  };
  
  React.useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);
  
  if (!course) {
    return null;
  }
  
  const getCourseName = (): string => {
    if (i18n.language === 'en' && course.name_english) {
      return course.name_english;
    }
    return course.name_stylized || course.name;
  };
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick(courseState.id);
    }
  };

  const handleMouseDownHandler = (e: React.MouseEvent) => {
    if (onMouseDown) {
      onMouseDown(e, courseState.id);
    }
  };
  
  const getTypeClassName = (type: string): string => {
    const typeMap: Record<string, string> = {
      'dcc': 'dcc',
      'fmat': 'fmat',
      'major': 'major',
      'ofg': 'ofg',
      'eti': 'eti',
      'opt': 'opt',
      'optcomp': 'optcomp',
      'opt-cien': 'opt-cien',
      'optcom': 'optcom',
      'opt-mat': 'opt-mat',
      'opt-ast': 'opt-ast',
      'optlet': 'optlet',
      'optbio': 'optbio',
      'econ': 'econ',
      'engdiag': 'engdiag',
      'engcour': 'engcour',
      'general': 'general'
    };
    return typeMap[type] || 'opt';
  };

  const getBackgroundColor = (): string => {
    const typeKey = getTypeClassName(course.type) as keyof typeof currentPalette.colors;
    return currentPalette.colors[typeKey] || currentPalette.colors.opt;
  };
  
  return (
    <div
      ref={courseRef}
      className={clsx(
        styles.course,
        courseState.taken && styles.taken
      )}
      style={{
        background: getBackgroundColor(),
        ...(highlightColor && {
          boxShadow: `0 0 0 2px ${highlightColor}, 0 0 20px 2px ${highlightColor}80`,
          zIndex: 1000
        })
      }}
      onMouseDown={handleMouseDownHandler}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-course-id={courseState.id}
      data-course-code={course.id}
    >
      {showEditIcon && onEdit && (
        <button 
          className={styles.editButton} 
          onClick={handleEditClick} 
          onMouseDown={(e) => e.stopPropagation()}
          title={t('editCourse')}
        >
          ✎
        </button>
      )}
      <div className={styles.courseContent}>
        <div className={styles.courseName}>
          {getCourseName()}
        </div>
        <div className={styles.sigla}>
          {course.id}
        </div>
        <div className={styles.credits}>
          {course.cred} {t('credits')}
        </div>
      </div>
    </div>
  );
}