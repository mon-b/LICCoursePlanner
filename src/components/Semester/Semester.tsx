import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SemesterState } from '../../types/course';
import { useCoursePlanner } from '../../context/CoursePlannerContext';
import Course from '../Course/Course';
import styles from './Semester.module.css';

interface SemesterProps {
  semester: SemesterState;
  onDrop: (e: React.DragEvent, semesterId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onCourseClick: (courseId: string) => void;
  onDragStart: (e: React.DragEvent, courseId: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
}


export default function Semester({ semester, onDrop, onDragOver, onCourseClick, onDragStart, onDragEnd }: SemesterProps) {
  const { t } = useTranslation();
  const { dispatch } = useCoursePlanner();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(e, `sem${semester.number}`);
  };

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
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
          onDragOver(e);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        {semester.courses.map((courseState) => (
          <Course
            key={courseState.id}
            courseState={courseState}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onClick={onCourseClick}
          />
        ))}
      </div>
    </div>
  );
}
