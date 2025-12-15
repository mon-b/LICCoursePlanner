import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useCoursePlanner } from '../../context/CoursePlannerContext';
import { validatePrerequisites, isParityValid } from '../../utils/courseValidation';
import Semester from '../../components/Semester/Semester';
import CoursePool from '../../components/CoursePool/CoursePool';
import CourseCreationModal from '../../components/CourseCreationModal/CourseCreationModal';
import LanguageToggle from '../../components/LanguageToggle/LanguageToggle';
import PaletteToggle from '../../components/PaletteToggle/PaletteToggle';
import PrerequisiteLines from '../../components/PrerequisiteLines/PrerequisiteLines';
import DragLayer from '../../components/DragLayer/DragLayer';
import styles from './PlannerPage.module.css';

interface DragState {
  courseId: string | null;
  x: number;
  y: number;
  offset: { x: number; y: number };
}

interface DropTarget {
  containerId: string;
  index: number;
}

export default function PlannerPage() {
  const { t } = useTranslation();
  const { state, dispatch, findCourseData } = useCoursePlanner();
  
  const [dragState, setDragState] = useState<DragState>({
    courseId: null,
    x: 0,
    y: 0,
    offset: { x: 0, y: 0 }
  });
  
  const [activeDropTarget, setActiveDropTarget] = useState<DropTarget | null>(null);
  
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [hoveredCourseId, setHoveredCourseId] = useState<string | null>(null);
  const [prereqColors, setPrereqColors] = useState<Map<string, string>>(new Map());

  const dragStateRef = useRef(dragState);
  const activeDropTargetRef = useRef(activeDropTarget);
  
  const dragStartRef = useRef<{ x: number, y: number, courseId: string | null, offset: { x: number, y: number } } | null>(null);

  useEffect(() => {
    dragStateRef.current = dragState;
  }, [dragState]);

  useEffect(() => {
    activeDropTargetRef.current = activeDropTarget;
  }, [activeDropTarget]);


  const handleMouseDown = useCallback((e: React.MouseEvent, courseId: string) => {
    e.preventDefault();
    
    const element = e.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      courseId,
      offset: { x: offsetX, y: offsetY }
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);
  }, []);

  const handleWindowMouseMove = useCallback((e: MouseEvent) => {
    const start = dragStartRef.current;
    
    
    if (dragStateRef.current.courseId) {
      setDragState(prev => ({
        ...prev,
        x: e.clientX - prev.offset.x,
        y: e.clientY - prev.offset.y
      }));
      return;
    }

    
    if (start && start.courseId) {
      const dist = Math.sqrt(
        Math.pow(e.clientX - start.x, 2) + Math.pow(e.clientY - start.y, 2)
      );

      if (dist > 5) { 
        
        document.body.classList.add('globalGrabbing');
        document.body.style.cursor = 'grabbing';
        
        setDragState({
          courseId: start.courseId,
          x: e.clientX - start.offset.x, 
          y: e.clientY - start.offset.y,
          offset: start.offset
        });
      }
    }
  }, []);

  const handleWindowMouseUp = useCallback((e: MouseEvent) => {
    const currentDrag = dragStateRef.current;
    const currentTarget = activeDropTargetRef.current;
    const start = dragStartRef.current;

    window.removeEventListener('mousemove', handleWindowMouseMove);
    window.removeEventListener('mouseup', handleWindowMouseUp);

    
    if (currentDrag.courseId && currentTarget) {
      const courseId = currentDrag.courseId;
      const { containerId, index } = currentTarget;
      
      const courseData = findCourseData(courseId);
      
      if (courseData) {
        let isValid = true;
        
        if (containerId.startsWith('sem')) {
          const semesterNumber = parseInt(containerId.replace('sem', ''));

          if (!isParityValid(courseData, semesterNumber)) {
            alert(t('parityError'));
            isValid = false;
          } else if (!validatePrerequisites(courseId, semesterNumber, state, findCourseData)) {
            const prereqMessage = getPrerequisiteErrorMessage(courseData, t);
            alert(prereqMessage);
            isValid = false;
          }
        }

        if (isValid) {
          let fromContainer = 'course-pool';
          for (const semester of state.semesters) {
            if (semester.courses.some(c => c.id === courseId)) {
              fromContainer = `sem${semester.number}`;
              break;
            }
          }

          dispatch({
            type: 'MOVE_COURSE',
            payload: {
              courseId,
              fromContainer,
              toContainer: containerId,
              toIndex: index
            }
          });
        }
      }
    } else if (!currentDrag.courseId && start && start.courseId) {
      
      dispatch({ type: 'TOGGLE_COURSE_TAKEN', payload: { courseId: start.courseId } });
    }

    
    setDragState({ courseId: null, x: 0, y: 0, offset: { x: 0, y: 0 } });
    setActiveDropTarget(null);
    dragStartRef.current = null;
    
    
    document.body.classList.remove('globalGrabbing');
    document.body.style.cursor = '';
  }, [state, findCourseData, dispatch, t]);

  const handleUpdateDropTarget = useCallback((containerId: string | null, index?: number) => {
    if (containerId) {
      setActiveDropTarget({ containerId, index: index ?? 0 });
    } else {
      setActiveDropTarget(null);
    }
  }, []);


  const handleCourseClick = (courseId: string) => {
    
  };

  const handleAddSemester = () => {
    if (window.confirm(t('confirmAddSemester'))) {
      dispatch({ type: 'ADD_SEMESTER' });
    }
  };

  const handleResetPlanner = () => {
    if (window.confirm(t('confirmReset'))) {
      dispatch({ type: 'RESET_PLANNER' });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundGradient}></div>
      <div className={styles.backgroundOrbs}>
        <div className={styles.orb1}></div>
        <div className={styles.orb2}></div>
        <div className={styles.orb3}></div>
      </div>

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.titleLink}>
            <h1 className={styles.title}>{t('title')}</h1>
          </Link>
          <div className={styles.headerActions}>
            <button className={styles.headerButton} onClick={handleAddSemester}>
              <span className={styles.headerIcon}>➕</span>
              {t('addSemester')}
            </button>

            <button className={styles.headerButton} onClick={handleResetPlanner}>
              <span className={styles.headerIcon}>🔄</span>
              {t('resetPlan')}
            </button>

            <PaletteToggle />
            <LanguageToggle />
          </div>
        </div>
      </header>

      <div className={styles.coursePoolToggleWrapper}>
        <button
          className={`${styles.showCoursesButton} ${state.coursePoolVisible ? styles.connected : ''}`}
          onClick={() => dispatch({ type: 'TOGGLE_COURSE_POOL' })}
        >
          <span className={styles.buttonIcon}>📚</span>
          {state.coursePoolVisible ? t('hideCoursePool') : t('showCoursePool')}
        </button>
      </div>

      <div className={styles.coursePoolWrapper}>
        <CoursePool
          isVisible={state.coursePoolVisible}
          onCourseClick={handleCourseClick}
          onMouseDown={handleMouseDown}
          onClose={() => dispatch({ type: 'TOGGLE_COURSE_POOL' })}
          onCreateCourse={() => setShowCourseModal(true)}
          onHoverStart={setHoveredCourseId}
          onHoverEnd={() => setHoveredCourseId(null)}
          prereqColors={prereqColors}
          draggedCourseId={dragState.courseId}
          activeDropTarget={activeDropTarget}
          onUpdateDropTarget={handleUpdateDropTarget}
        />
      </div>

      <div className={styles.semesterArea}>
        <div className={styles.semesterGrid}>
          {state.semesters
            .sort((a, b) => a.number - b.number)
            .map(semester => (
              <div
                key={semester.number}
                className={styles.semesterCard}
              >
                <Semester
                  semester={semester}
                  onCourseClick={handleCourseClick}
                  onMouseDown={handleMouseDown}
                  onHoverStart={setHoveredCourseId}
                  onHoverEnd={() => setHoveredCourseId(null)}
                  prereqColors={prereqColors}
                  draggedCourseId={dragState.courseId}
                  activeDropTarget={activeDropTarget}
                  onUpdateDropTarget={handleUpdateDropTarget}
                />
              </div>
            ))}
        </div>
      </div>

      <CourseCreationModal
        isOpen={showCourseModal}
        onClose={() => setShowCourseModal(false)}
        onCreateCourse={(course) => {
          dispatch({ type: 'CREATE_CUSTOM_COURSE', payload: course });
          setShowCourseModal(false);
        }}
      />

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          {t('footerText')}{' '}
          <a
            href="https://instagram.com/w1ndtempos"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            Mon 🌸
          </a>{' '}
          {t('footerAnd')}{' '}
          <a
            href="https://www.instagram.com/fercooncha"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            fña🧙‍♂️
          </a>
        </div>
      </footer>

      <PrerequisiteLines
        hoveredCourseId={dragState.courseId ? null : hoveredCourseId}
        onPrereqColorsChange={setPrereqColors}
      />
      
      <DragLayer 
        courseId={dragState.courseId} 
        position={{ x: dragState.x, y: dragState.y }} 
      />
    </div>
  );
}

function getPrerequisiteErrorMessage(course: any, t: any): string {
  let message = t('prerequisitesError', { course: course.name_stylized }) + '\n\n';

  if (course.prereq) {
    const mainAlternatives = course.prereq.split(' o ');

    const prereqMessages = mainAlternatives.map((alternative: string) => {
      if (alternative.includes(' y ')) {
        const courses = alternative.split(' y ');
        const cleanCourses = courses.map((c: string) => c.replace(/[()]/g, '').trim());
        return `• ${t('prerequisiteMultiple', { courses: cleanCourses.join(' y ') })}`;
      } else {
        const cleanCourse = alternative.replace(/[()]/g, '').trim();
        if (cleanCourse.includes('(c)')) {
          const courseId = cleanCourse.replace('(c)', '');
          return `• ${t('prerequisiteCorequisite', { course: courseId })}`;
        }
        return `• ${t('prerequisiteSingle', { course: cleanCourse })}`;
      }
    });

    message += prereqMessages.join(`\n ${t('prerequisiteOr')} \n`);
  }

  return message.trim();
}