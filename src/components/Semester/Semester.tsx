import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SemesterState } from '../../types/course';
import { useCoursePlanner } from '../../context/CoursePlannerContext';
import Course from '../Course/Course';
import styles from './Semester.module.css';
import clsx from 'clsx';

interface SemesterProps {
  semester: SemesterState;
  onCourseClick: (courseId: string) => void;
  onMouseDown: (e: React.MouseEvent, courseId: string) => void;
  onHoverStart?: (courseId: string) => void;
  onHoverEnd?: () => void;
  onEdit?: (courseId: string) => void;
  prereqColors?: Map<string, string>;
  draggedCourseId: string | null;
  activeDropTarget: { containerId: string; index: number } | null;
  onUpdateDropTarget: (containerId: string | null, index?: number) => void;
}

export default function Semester({
  semester,
  onCourseClick,
  onMouseDown,
  onHoverStart,
  onHoverEnd,
  onEdit,
  prereqColors,
  draggedCourseId,
  activeDropTarget,
  onUpdateDropTarget
}: SemesterProps) {
  const { t } = useTranslation();
  const { dispatch, findCourseData } = useCoursePlanner();

  const calculateInsertIndex = (e: React.MouseEvent, containerElement: HTMLElement): number => {
    const rect = containerElement.getBoundingClientRect();
    const y = e.clientY - rect.top;
    
    const SLOT_HEIGHT = 99;
    
    const isInternalDrag = semester.courses.some(c => c.id === draggedCourseId);
    const maxIndex = semester.courses.length - (isInternalDrag ? 1 : 0);
    
    let index = Math.round(y / SLOT_HEIGHT);
    return Math.max(0, Math.min(index, maxIndex));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedCourseId) return;
    
    const containerElement = e.currentTarget as HTMLElement;
    const index = calculateInsertIndex(e, containerElement);
    
    onUpdateDropTarget(`sem${semester.number}`, index);
  };

  const handleMouseLeave = () => {
    if (draggedCourseId) {
    }
  };

  const draggedCourseData = draggedCourseId ? findCourseData(draggedCourseId) : null;
  
  const isTarget = activeDropTarget?.containerId === `sem${semester.number}`;
  const insertIndex = isTarget ? activeDropTarget.index : null;

  const draggedCourseIndex = semester.courses.findIndex(c => c.id === draggedCourseId);
  
  let renderInsertIndex = insertIndex;
  
  if (insertIndex !== null && isTarget) {
    if (draggedCourseIndex !== -1 && insertIndex >= draggedCourseIndex) {
       renderInsertIndex = insertIndex + 1;
    } else {
       renderInsertIndex = insertIndex;
    }
  } else {
    renderInsertIndex = null;
  }

  
  const isDragOver = isTarget;

  const totalCredits = useMemo(() => {
    return semester.courses.reduce((sum, courseState) => {
      const course = findCourseData(courseState.id);
      return sum + (course ? parseInt(course.cred || '0', 10) : 0);
    }, 0);
  }, [semester.courses, findCourseData]);

  return (
    <div className={styles.semester}>
      <div className={styles.semesterHead}>
        <span>{t('semester')} {semester.number}</span>
        {semester.number > 8 && (
          <button
            className={styles.deleteSemesterBtn}
            onClick={() => {
              if (window.confirm(t('confirmDeleteSemester'))) {
                dispatch({ type: 'DELETE_SEMESTER', payload: { semesterNumber: semester.number } });
              }
            }}
            title={t('deleteSemester')}
          >
          </button>
        )}
      </div>

      <div
        className={clsx(styles.coursesContainer, draggedCourseId && styles.coursesContainerDragging)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {semester.courses.map((courseState, index) => {
          const isBeingDragged = courseState.id === draggedCourseId;
          const showPlaceholder = isDragOver && renderInsertIndex === index;
          const courseData = findCourseData(courseState.id);
          const resolvedId = courseData ? courseData.id : courseState.id;
          const highlight = prereqColors?.get(resolvedId) || prereqColors?.get(courseState.id);

          return (
            <React.Fragment key={courseState.id}>
              <div 
                className={clsx(styles.coursePlaceholder, showPlaceholder && styles.placeholderOpen)} 
              />
              
              <div 
                {...(!isBeingDragged ? { 'data-course-element': true } : {})}
                className={clsx(styles.courseWrapper, isBeingDragged && styles.collapsedCourseWrapper)}
              >
                <Course
                  courseState={courseState}
                  onMouseDown={onMouseDown}
                  onClick={onCourseClick}
                  onHoverStart={onHoverStart}
                  onHoverEnd={onHoverEnd}
                  onEdit={onEdit}
                  highlightColor={highlight}
                />
              </div>
            </React.Fragment>
          );
        })}
        
        <div 
          className={clsx(
            styles.coursePlaceholder, 
            (isDragOver && renderInsertIndex === semester.courses.length) && styles.placeholderOpen
          )} 
        />

        {semester.courses.length === 0 && !draggedCourseId && (
          <div className={styles.emptyMessage}>
            {t('dropCoursesHere')}
          </div>
        )}
        
        {semester.courses.length === 0 && draggedCourseId && !renderInsertIndex && (
           <div className={styles.emptyMessage}>
             {t('dropCoursesHere')}
           </div>
        )}
      </div>
      
      <div className={styles.semesterFooter}>
        <span className={styles.creditsValue}>{totalCredits}</span> {t('courseCredits')}
      </div>
    </div>
  );
}