import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { useCoursePlanner } from '../../context/CoursePlannerContext';
import { validatePrerequisites, isParityValid } from '../../utils/courseValidation';
import Semester from '../../components/Semester/Semester';
import CoursePool from '../../components/CoursePool/CoursePool';
import CourseEditor from '../../components/CourseEditor/CourseEditor';
import CourseSelector from '../../components/CourseSelector/CourseSelector';
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
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [selectingCourseId, setSelectingCourseId] = useState<string | null>(null);
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
  }, [state, findCourseData, dispatch, t, handleWindowMouseMove]);

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
  }, [handleWindowMouseMove, handleWindowMouseUp]);

  const handleUpdateDropTarget = useCallback((containerId: string | null, index?: number) => {
    if (containerId) {
      setActiveDropTarget({ containerId, index: index ?? 0 });
    } else {
      setActiveDropTarget(null);
    }
  }, []);


  const handleCourseClick = (courseId: string) => {
    
  };

  const handleCourseEdit = (courseId: string) => {
    const course = findCourseData(courseId);
    
    if (state.coursePoolVisible) {
        dispatch({ type: 'TOGGLE_COURSE_POOL' });
    }

    const electiveTypes = [
        'opt', 'opt-cien', 'optcomp', 'opt-mat', 'optlet', 'econ', 'optcom', 'opt-ast', 'optbio'
    ];

    if (course && (electiveTypes.includes(course.type) || courseId === 'OPTC1')) {
        if (selectingCourseId === courseId) {
            setSelectingCourseId(null);
        } else {
            setSelectingCourseId(courseId);
            setEditingCourseId(null);
        }
    } else if (course && course.type === 'ofg' && course.id !== 'FIL2001') {
        if (editingCourseId === courseId) {
            setEditingCourseId(null);
        } else {
            setEditingCourseId(courseId);
            setSelectingCourseId(null);
        }
    }
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

  const handleExportToPNG = async () => {
    const semesterGrid = document.querySelector(`.${styles.semesterGrid}`) as HTMLElement;
    if (!semesterGrid) return;

    const semesterCards = semesterGrid.querySelectorAll(`.${styles.semesterCard}`);
    if (semesterCards.length === 0) return;

    try {
      const firstCard = semesterCards[0] as HTMLElement;
      const lastCard = semesterCards[semesterCards.length - 1] as HTMLElement;

      const firstRect = firstCard.getBoundingClientRect();
      const lastRect = lastCard.getBoundingClientRect();
      const gridRect = semesterGrid.getBoundingClientRect();

      const padding = 30;
      const x = firstRect.left - gridRect.left - padding;
      const y = -padding;
      const width = (lastRect.right - firstRect.left) + (padding * 2);
      const height = gridRect.height + (padding * 2);

      const canvas = await html2canvas(semesterGrid, {
        backgroundColor: '#0f0f23',
        scale: 2,
        logging: false,
        useCORS: true,
        x: x,
        y: y,
        width: width,
        height: height,
      });

      const link = document.createElement('a');
      link.download = `planner-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error exporting to PNG:', error);
      alert('Error al exportar la imagen. Por favor, intenta de nuevo.');
    }
  };

  const sidePanelOpen = state.coursePoolVisible || !!editingCourseId || !!selectingCourseId;

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

            <button className={styles.headerButton} onClick={handleExportToPNG}>
              <span className={styles.headerIcon}>📸</span>
              {t('exportPNG')}
            </button>

            <PaletteToggle />
            <LanguageToggle />
          </div>
        </div>
      </header>

      <div className={styles.mainLayout}>
        <div className={styles.contentContainer}>
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
                      onEdit={handleCourseEdit}
                      prereqColors={prereqColors}
                      draggedCourseId={dragState.courseId}
                      activeDropTarget={activeDropTarget}
                      onUpdateDropTarget={handleUpdateDropTarget}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div 
          className={styles.toggleHandle}
          onClick={() => {
            if (editingCourseId) setEditingCourseId(null);
            else if (selectingCourseId) setSelectingCourseId(null);
            else dispatch({ type: 'TOGGLE_COURSE_POOL' });
          }}
          title={
            editingCourseId || selectingCourseId
              ? t('closeEditor')
              : (state.coursePoolVisible ? t('hideCoursePool') : t('showCoursePool'))
          }
        >
          <span className={styles.toggleArrow}>
            {sidePanelOpen ? '▶' : '◀'}
          </span>
        </div>

        <div className={`${styles.sidePanel} ${sidePanelOpen ? styles.open : ''}`}>
          {editingCourseId ? (
            <CourseEditor
              course={findCourseData(editingCourseId) || null}
              isOpen={!!editingCourseId}
              onClose={() => setEditingCourseId(null)}
              onSave={(originalId, updatedCourse) => {
                dispatch({ 
                  type: 'UPDATE_COURSE', 
                  payload: { originalId, course: updatedCourse } 
                });
                setEditingCourseId(null);
              }}
            />
          ) : selectingCourseId ? (
            <CourseSelector
              isOpen={!!selectingCourseId}
              onClose={() => setSelectingCourseId(null)}
              filterType={
                selectingCourseId === 'OPTC1' 
                  ? 'opt-cien' 
                  : ['optcomp', 'optlet', 'econ', 'optcom', 'opt-ast', 'optbio', 'opt-mat']
              }
              enableCategories={selectingCourseId !== 'OPTC1'}
              onSelect={(course) => {
                let semesterNumber = 0;
                for (const sem of state.semesters) {
                  if (sem.courses.some(c => c.id === selectingCourseId)) {
                    semesterNumber = sem.number;
                    break;
                  }
                }

                if (semesterNumber > 0) {
                   if (!validatePrerequisites(course.id, semesterNumber, state, findCourseData)) {
                      const msg = getPrerequisiteErrorMessage(course, t);
                      alert(msg);
                      return;
                   }
                }

                if (course.type === 'optcomp') {
                  let optCompCount = 0;
                  state.semesters.forEach(sem => {
                    sem.courses.forEach(c => {
                      const courseData = findCourseData(c.id);
                      if (courseData?.type === 'optcomp') {
                        optCompCount++;
                      }
                    });
                  });
                  
                  const currentSlotCourse = selectingCourseId ? findCourseData(selectingCourseId) : null;
                  const isReplacingOptComp = currentSlotCourse?.type === 'optcomp';
                  
                  if (!isReplacingOptComp && optCompCount >= 2) {
                    alert("Como máximo solamente se pueden tener 2 cursos OPT de computación");
                    return;
                  }
                }

                dispatch({
                    type: 'UPDATE_COURSE',
                    payload: {
                        originalId: selectingCourseId,
                        course: { ...course, id: course.id }
                    }
                });
                setSelectingCourseId(null);
              }}
            />
          ) : (
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
          )}
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
          </a>
          {' '}
          <a
            href="https://www.instagram.com/fercooncha"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            fña 🧙‍♂️
          </a>
          {t('footerAnd')}{' '}
          <a
            href="https://www.instagram.com/esteban._.d._.luffy/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            estebankito 🎸
          </a>
        </div>
      </footer>

      <PrerequisiteLines
        hoveredCourseId={hoveredCourseId}
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
      const creditsMatch = alternative.match(/créditos\s*>=\s*(\d+)/i);
      if (creditsMatch) {
        return `• ${t('prerequisiteCredits', { credits: creditsMatch[1] })}`;
      }

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