import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useCoursePlanner } from '../../context/CoursePlannerContext';
import { validatePrerequisites, isParityValid } from '../../utils/courseValidation';
import Semester from '../../components/Semester/Semester';
import CoursePool from '../../components/CoursePool/CoursePool';
import CourseCreationModal from '../../components/CourseCreationModal/CourseCreationModal';
import LanguageToggle from '../../components/LanguageToggle/LanguageToggle';
import PaletteToggle from '../../components/PaletteToggle/PaletteToggle';
import styles from './PlannerPage.module.css';

export default function PlannerPage() {
  const { t } = useTranslation();
  const { state, dispatch, findCourseData } = useCoursePlanner();
  const [draggedCourse, setDraggedCourse] = useState<string | null>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);

  const handleDragStart = (e: React.DragEvent, courseId: string) => {
    setDraggedCourse(courseId);
    e.dataTransfer.setData('text/plain', courseId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = (_e: React.DragEvent) => {
    setDraggedCourse(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, containerId: string, toIndex?: number) => {
    e.preventDefault();

    const courseId = e.dataTransfer.getData('text/plain');
    if (!courseId || !draggedCourse) return;

    const courseData = findCourseData(courseId);
    if (!courseData) return;

    // Find source container
    let fromContainer = 'course-pool';
    for (const semester of state.semesters) {
      if (semester.courses.some(c => c.id === courseId)) {
        fromContainer = `sem${semester.number}`;
        break;
      }
    }

    // Validate semester-specific constraints
    if (containerId.startsWith('sem')) {
      const semesterNumber = parseInt(containerId.replace('sem', ''));

      if (!isParityValid(courseData, semesterNumber)) {
        alert(t('parityError'));
        return;
      }

      if (!validatePrerequisites(courseId, semesterNumber, state, findCourseData)) {
        const prereqMessage = getPrerequisiteErrorMessage(courseData, t);
        alert(prereqMessage);
        return;
      }
    }

    dispatch({
      type: 'MOVE_COURSE',
      payload: {
        courseId,
        fromContainer,
        toContainer: containerId,
        toIndex
      }
    });
  };

  const handleCourseClick = (courseId: string) => {
    dispatch({ type: 'TOGGLE_COURSE_TAKEN', payload: { courseId } });
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

      {/* Course Pool Toggle Button */}
      <div className={styles.coursePoolToggleWrapper}>
        <button
          className={`${styles.showCoursesButton} ${state.coursePoolVisible ? styles.connected : ''}`}
          onClick={() => dispatch({ type: 'TOGGLE_COURSE_POOL' })}
        >
          <span className={styles.buttonIcon}>📚</span>
          {state.coursePoolVisible ? t('hideCoursePool') : t('showCoursePool')}
        </button>
      </div>

      {/* Animated Course Pool */}
      <div className={styles.coursePoolWrapper}>
        <CoursePool
          isVisible={state.coursePoolVisible}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onCourseClick={handleCourseClick}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onClose={() => dispatch({ type: 'TOGGLE_COURSE_POOL' })}
          onCreateCourse={() => setShowCourseModal(true)}
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
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onCourseClick={handleCourseClick}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                />
              </div>
            ))}
        </div>
      </div>

      {/* Course Creation Modal */}
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