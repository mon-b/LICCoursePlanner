import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useCoursePlanner } from '../../context/CoursePlannerContext';
import Course from '../Course/Course';
import styles from './CoursePool.module.css';

interface CoursePoolProps {
  onDrop: (e: React.DragEvent, containerId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onCourseClick: (courseId: string) => void;
  onDragStart: (e: React.DragEvent, courseId: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onClose: () => void;
  onCreateCourse: () => void;
  isVisible: boolean;
}

export default function CoursePool({
  onDrop,
  onDragOver,
  onCourseClick,
  onDragStart,
  onDragEnd,
  onCreateCourse,
  isVisible,
}: CoursePoolProps) {
  const { t } = useTranslation();
  const { state, findCourseData } = useCoursePlanner();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(isVisible);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // animation hehe
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
  
  const categories = useMemo(() => [
    { id: 'all', label: t('categories.all', 'All Courses'), types: [] },
    { id: 'core', label: t('categories.core', 'Core CS'), types: ['dcc', 'major'] },
    { id: 'math', label: t('categories.math', 'Mathematics'), types: ['fmat', 'opt-mat'] },
    { id: 'electives', label: t('categories.electives', 'Electives'), types: ['optcomp', 'opt-cien', 'optlet', 'econ', 'optcom', 'opt-ast', 'optbio'] },
    { id: 'general', label: t('categories.general', 'General'), types: ['ofg', 'eti'] }
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
  
  const handleDrop = (e: React.DragEvent) => {
    onDrop(e, 'course-pool');
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
  
  if (!shouldRender) {
    return null;
  }
  
  return (
    <div 
      ref={containerRef}
      className={`${styles.container} ${isAnimating ? styles.visible : styles.hidden}`}
    >
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>{t('availableCourses', 'Available Courses')}</h2>
      </div>
      
      {/* Search */}
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
      
      {/* Categories */}
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
      
      
      {/* Course List */}
      <div 
        className={styles.courseList}
        onDrop={handleDrop}
        onDragOver={onDragOver}
      >
        {/* Add Course Button */}
        <div className={styles.addCourseSection}>
          <button 
            className={styles.addButton}
            onClick={onCreateCourse}
          >
            <span className={styles.addIcon}>+</span>
            {t('createCustomCourse', 'Create Custom Course')}
          </button>
        </div>
        
        {/* Courses grouped by type */}
        {Object.entries(coursesByType).map(([typeLabel, courses]) => (
          <div key={typeLabel} className={styles.courseGroup}>
            <h3 className={styles.groupTitle}>{typeLabel}</h3>
            <div className={styles.coursesGrid}>
              {courses.map(courseState => (
                <div key={courseState.id} className={styles.courseWrapper}>
                  <Course
                    courseState={courseState}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onClick={onCourseClick}
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
  );
}