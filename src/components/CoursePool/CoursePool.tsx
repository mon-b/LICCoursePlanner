import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useCoursePlanner } from '../../context/CoursePlannerContext';
import Course from '../Course/Course';
import FloatingTooltip from '../FloatingTooltip/FloatingTooltip';
import styles from './CoursePool.module.css';

interface CoursePoolProps {
  onCourseClick: (courseId: string) => void;
  onMouseDown: (e: React.MouseEvent, courseId: string) => void;
  onClose: () => void;
  onCreateCourse: () => void;
  isVisible: boolean;
  onHoverStart?: (courseId: string) => void;
  onHoverEnd?: () => void;
  prereqColors?: Map<string, string>;
  activeDropTarget: { containerId: string; index: number } | null;
  onUpdateDropTarget: (containerId: string | null, index?: number) => void;
  draggedCourseId: string | null;
}

export default function CoursePool({
  onCourseClick,
  onMouseDown,
  onCreateCourse,
  isVisible,
  onHoverStart,
  onHoverEnd,
  prereqColors,
  onUpdateDropTarget
}: CoursePoolProps) {
  const { t } = useTranslation();
  const { state, findCourseData } = useCoursePlanner();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(isVisible);
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const [tooltip, setTooltip] = useState<{ content: string; rect: DOMRect | null; visible: boolean }>({
    content: '',
    rect: null,
    visible: false
  });
  
  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      const timer = setTimeout(() => setIsAnimating(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), 350);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);
  
  const categories = useMemo(() => [
    { id: 'all', label: t('categories.all'), types: [] },
    { id: 'core', label: t('categories.core'), types: ['dcc', 'major'] },
    { id: 'math', label: t('categories.math'), types: ['fmat'] },
    { id: 'opt_cs', label: t('courseTypes.optcomp'), types: ['optcomp'] },
    { id: 'opt_science', label: t('courseTypes.opt-cien'), types: ['opt-cien'] },
    { id: 'opt_mat', label: t('courseTypes.opt-mat'), types: ['opt-mat'] },
    { id: 'opt_lit', label: t('courseTypes.optlet'), types: ['optlet'] },
    { id: 'opt_econ', label: t('courseTypes.econ'), types: ['econ'] },
    { id: 'opt_com', label: t('courseTypes.optcom'), types: ['optcom'] },
    { id: 'opt_astro', label: t('courseTypes.opt-ast'), types: ['opt-ast'] },
    { id: 'opt_bio', label: t('courseTypes.optbio'), types: ['optbio'] },
    { id: 'general', label: t('categories.general'), types: ['ofg', 'eti'] }
  ], [t]);
  
  const filteredCourses = useMemo(() => {
    return state.coursePool.filter(courseState => {
      const course = findCourseData(courseState.id);
      if (!course) return false;
      
      const matchesSearch = !searchTerm || 
        course.name_stylized.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const selectedCategory = categories.find(cat => cat.id === activeCategory);
      const matchesCategory = activeCategory === 'all' || 
        (selectedCategory && selectedCategory.types.includes(courseState.type));
      
      return matchesSearch && matchesCategory;
    });
  }, [state.coursePool, findCourseData, searchTerm, activeCategory, categories]);
  
  const handleMouseMove = () => {
    onUpdateDropTarget('course-pool');
  };

  const handleMouseLeave = () => {
  };
  
  const coursesByType = useMemo(() => {
    const grouped: Record<string, typeof filteredCourses> = {};
    filteredCourses.forEach(courseState => {
      const course = findCourseData(courseState.id);
      if (course) {
        const typeLabel = t(`courseTypes.${courseState.type}`);
        if (!grouped[typeLabel]) {
          grouped[typeLabel] = [];
        }
        grouped[typeLabel].push(courseState);
      }
    });
    return grouped;
  }, [filteredCourses, findCourseData, t]);

  const getPrereqTooltip = (courseId: string) => {
    const course = findCourseData(courseId);
    if (!course || !course.prereq) return '';
    
    const formatCourse = (id: string) => {
      const cleanId = id.replace(/[()]/g, '').trim();
      const isCoreq = cleanId.includes('(c)');
      const searchId = cleanId.replace('(c)', '');
      
      const prereqCourse = findCourseData(searchId);
      if (prereqCourse) {
        return `${prereqCourse.name_stylized} - ${prereqCourse.id}${isCoreq ? ' (c)' : ''}`;
      }
      return cleanId;
    };

    let formattedPrereq = course.prereq
      .replace(/ o /g, '\n o \n')
      .replace(/ y /g, ' y ');

    const parts = course.prereq.split(/( o | y |[()])/);
    const formattedParts = parts.map(part => {
      const trimmed = part.trim();
      if (!trimmed || ['o', 'y', '(', ')'].includes(trimmed)) return part;
      
      const cleanId = trimmed.replace('(c)', '');
      const prereqCourse = findCourseData(cleanId);
      if (prereqCourse) {
         return `${prereqCourse.name_stylized} - ${prereqCourse.id}${trimmed.includes('(c)') ? ' (Corequisito)' : ''}`;
      }
      return part;
    });
    
    let displayString = course.prereq;
    
    const potentialCodes = course.prereq.match(/[A-Z]+[0-9]+[A-Z]*/g) || [];
    
    const uniqueCodes = Array.from(new Set(potentialCodes));
    
    uniqueCodes.forEach(code => {
      const prereqCourse = findCourseData(code);
      if (prereqCourse) {
        const regex = new RegExp(`\\b${code}\\b`, 'g');
        displayString = displayString.replace(regex, `${prereqCourse.name_stylized} - ${prereqCourse.id}`);
      }
    });

    displayString = displayString
      .replace(/ o /g, '\n--- O ---\n')
      .replace(/ y /g, '\n');

    return `Prerrequisitos:\n${displayString}`;
  };

  const handleCourseEnter = (e: React.MouseEvent<HTMLDivElement>, courseId: string) => {
    const content = getPrereqTooltip(courseId);
    if (content) {
      const rect = e.currentTarget.getBoundingClientRect();
      hoverTimeoutRef.current = setTimeout(() => {
        setTooltip({ content, rect, visible: true });
      }, 200);
    }
  };

  const handleCourseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setTooltip(prev => ({ ...prev, visible: false }));
  };
  
  if (!shouldRender) {
    return null;
  }
  
  return (
    <>
          <div 
            ref={containerRef}
            className={`${styles.container} ${isAnimating ? styles.visible : styles.hidden}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            data-region="course-pool"
          >        <div className={styles.header}>
          <h2 className={styles.title}>{t('availableCourses', 'Available Courses')}</h2>
        </div>
        
        <div className={styles.searchSection}>
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className={styles.categorySection}>
          <div className={styles.categoryTabs}>
            {categories.map(category => (
              <button
                key={category.id}
                className={`${styles.categoryTab} ${activeCategory === category.id ? styles.active : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
        
        
        <div className={styles.courseList}>
          <div className={styles.addCourseSection}>
            <button 
              className={styles.addButton}
              onClick={onCreateCourse}
            >
              <span className={styles.addIcon}>+</span>
              {t('createCustomCourse', 'Create Custom Course')}
            </button>
          </div>
          
          {Object.entries(coursesByType).map(([typeLabel, courses]) => (
            <div key={typeLabel} className={styles.courseGroup}>
              <h3 className={styles.groupTitle}>{typeLabel}</h3>
              <div className={styles.coursesGrid}>
                {courses.map(courseState => (
                  <div 
                    key={courseState.id} 
                    className={styles.courseWrapper}
                    onMouseEnter={(e) => handleCourseEnter(e, courseState.id)}
                    onMouseLeave={handleCourseLeave}
                  >
                    <Course
                      courseState={courseState}
                      onMouseDown={onMouseDown}
                      onClick={onCourseClick}
                      onHoverStart={undefined}
                      onHoverEnd={undefined}
                      highlightColor={prereqColors?.get(courseState.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {filteredCourses.length === 0 && (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>📚</span>
              <p>{t('noCoursesFound', 'No courses found matching your criteria')}</p>
            </div>
          )}
        </div>
      </div>
      <FloatingTooltip 
        content={tooltip.content} 
        targetRect={tooltip.rect} 
        visible={tooltip.visible} 
      />
    </>
  );
}