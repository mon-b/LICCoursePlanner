import React from 'react';
import { useTranslation } from 'react-i18next';
import { Course as CourseType, CourseState } from '../../types/course';
import { useCoursePlanner } from '../../context/CoursePlannerContext';
import styles from './Course.module.css';
import clsx from 'clsx';

interface CourseProps {
  courseState: CourseState;
  courseData?: CourseType;
  onDragStart?: (e: React.DragEvent, courseId: string) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onClick?: (courseId: string) => void;
  onHoverStart?: (courseId: string) => void;
  onHoverEnd?: () => void;
  highlightColor?: string;
}

export default function Course({
  courseState,
  courseData,
  onDragStart,
  onDragEnd,
  onClick,
  onHoverStart,
  onHoverEnd,
  highlightColor
}: CourseProps) {
  const { t, i18n } = useTranslation();
  const { findCourseData, getCurrentPalette } = useCoursePlanner();
  const courseRef = React.useRef<HTMLDivElement>(null);

  const course = courseData || findCourseData(courseState.id);
  const currentPalette = getCurrentPalette();

  const handleMouseEnter = () => {
    if (onHoverStart && course?.prereq) {
      onHoverStart(courseState.id);
    }
  };

  const handleMouseLeave = () => {
    if (onHoverEnd) {
      onHoverEnd();
    }
  };
  
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

  const handleDragStart = (e: React.DragEvent) => {
    if (onDragStart) {
      onDragStart(e, courseState.id);
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
      'opt-cien': 'optCien',
      'optcom': 'optcom',
      'opt-mat': 'optMat',
      'opt-ast': 'optAst',
      'optlet': 'optlet',
      'optbio': 'optbio',
      'econ': 'econ',
      'general': 'general'
    };
    return typeMap[type] || 'opt';
  };

  const getBackgroundColor = (): string => {
    const typeKey = getTypeClassName(courseState.type) as keyof typeof currentPalette.colors;
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
          // Replaced border with box-shadow to prevent text shift
          boxShadow: `0 0 0 3px ${highlightColor}, 0 0 10px ${highlightColor}40`,
          zIndex: 1000
        })
      }}
      draggable
      onClick={handleClick}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-course-id={courseState.id}
    >
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