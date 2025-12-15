import React from 'react';
import Course from '../Course/Course';
import { useCoursePlanner } from '../../context/CoursePlannerContext';
import styles from './DragLayer.module.css';

interface DragLayerProps {
  courseId: string | null;
  position: { x: number; y: number };
}

export default function DragLayer({ courseId, position }: DragLayerProps) {
  const { findCourseData } = useCoursePlanner();

  if (!courseId) return null;

  const courseData = findCourseData(courseId);
  const courseState = {
    id: courseId,
    type: courseData?.type || 'opt',
    taken: false,
  };

  return (
    <div 
      className={styles.dragLayer}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      <div className={styles.dragGhost} style={{ width: '110px' }}>
        <Course
          courseState={courseState}
        />
      </div>
    </div>
  );
}