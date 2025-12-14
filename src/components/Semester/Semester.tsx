import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SemesterState } from '../../types/course';
import { useCoursePlanner } from '../../context/CoursePlannerContext';
import Course from '../Course/Course';
import styles from './Semester.module.css';

interface SemesterProps {
  semester: SemesterState;
  onDrop: (e: React.DragEvent, semesterId: string, toIndex?: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onCourseClick: (courseId: string) => void;
  onDragStart: (e: React.DragEvent, courseId: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onHoverStart?: (courseId: string) => void;
  onHoverEnd?: () => void;
  prereqColors?: Map<string, string>;
}

export default function Semester({ semester, onDrop, onDragOver, onCourseClick, onDragStart, onDragEnd, onHoverStart, onHoverEnd, prereqColors }: SemesterProps) {
  const { t } = useTranslation();
  const { dispatch, findCourseData } = useCoursePlanner();
  const [isDragOver, setIsDragOver] = useState(false);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);
  const [draggedCourseId, setDraggedCourseId] = useState<string | null>(null);

  React.useEffect(() => {
    const handleGlobalDragStart = (e: DragEvent) => {
      const courseId = e.dataTransfer?.getData('text/plain');
      if (courseId) {
        setDraggedCourseId(courseId);
      }
    };

    const handleGlobalDragEnd = () => {
      setDraggedCourseId(null);
    };

    document.addEventListener('dragstart', handleGlobalDragStart);
    document.addEventListener('dragend', handleGlobalDragEnd);

    return () => {
      document.removeEventListener('dragstart', handleGlobalDragStart);
      document.removeEventListener('dragend', handleGlobalDragEnd);
    };
  }, []);

  const calculateInsertIndex = (e: React.DragEvent, containerElement: HTMLElement): number => {
    const rect = containerElement.getBoundingClientRect();
    const y = e.clientY - rect.top;
    
    const courseElements = containerElement.querySelectorAll('[data-course-element]');
    
    for (let i = 0; i < courseElements.length; i++) {
      const courseRect = courseElements[i].getBoundingClientRect();
      const courseMiddle = courseRect.top + courseRect.height / 2 - rect.top;
      
      if (y < courseMiddle) {
        return i;
      }
    }
    
    return courseElements.length;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
    
    const containerElement = e.currentTarget as HTMLElement;
    const newInsertIndex = calculateInsertIndex(e, containerElement);
    setInsertIndex(newInsertIndex);
    
    onDragOver(e);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const containerElement = e.currentTarget as HTMLElement;
    const dropIndex = calculateInsertIndex(e, containerElement);
    setInsertIndex(null);
    
    onDrop(e, `sem${semester.number}`, dropIndex);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
      setInsertIndex(null);
    }
  };

  const draggedCourseData = draggedCourseId ? findCourseData(draggedCourseId) : null;

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
        className={`${styles.coursesContainer} ${isDragOver ? styles.dragOver : ''}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
      >
        {semester.courses.map((courseState, index) => (
          <React.Fragment key={courseState.id}>
            {isDragOver && insertIndex === index && (
              <>
                {draggedCourseData ? (
                  <div className={styles.coursePlaceholder}>
                    <div className={styles.placeholderContent}>
                      {draggedCourseData.id}
                    </div>
                  </div>
                ) : (
                  <div className={styles.insertIndicator} />
                )}
              </>
            )}
            
            <div data-course-element className={styles.courseWrapper}>
              <Course
                courseState={courseState}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onClick={onCourseClick}
                onHoverStart={onHoverStart}
                onHoverEnd={onHoverEnd}
                highlightColor={prereqColors?.get(courseState.id)}
              />
            </div>
          </React.Fragment>
        ))}
        
        {isDragOver && insertIndex === semester.courses.length && (
          <>
            {draggedCourseData ? (
              <div className={styles.coursePlaceholder}>
                <div className={styles.placeholderContent}>
                  {draggedCourseData.id}
                </div>
              </div>
            ) : (
              <div className={styles.insertIndicator} />
            )}
          </>
        )}

        {semester.courses.length === 0 && !isDragOver && (
          <div className={styles.emptyMessage}>
            {t('dropCoursesHere')}
          </div>
        )}
        
        {semester.courses.length === 0 && isDragOver && (
          <div className={styles.emptyDropIndicator}>
            {t('dropCoursesHere')}
          </div>
        )}
      </div>
    </div>
  );
}