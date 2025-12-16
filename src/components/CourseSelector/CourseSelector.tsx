import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCoursePlanner } from '../../context/CoursePlannerContext';
import { Course } from '../../types/course';
import styles from './CourseSelector.module.css';

interface CourseSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (course: Course) => void;
  filterType: string | string[];
  enableCategories?: boolean;
}

export default function CourseSelector({ isOpen, onClose, onSelect, filterType, enableCategories }: CourseSelectorProps) {
  const { t } = useTranslation();
  const { allCourses, state, findCourseData, getCurrentPalette } = useCoursePlanner();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const currentPalette = getCurrentPalette();

  const categories = useMemo(() => [
    { id: 'all', label: t('categories.all'), types: [] },
    { id: 'cs', label: t('courseTypes.optcomp'), types: ['optcomp'] },
    { id: 'math', label: t('courseTypes.opt-mat'), types: ['opt-mat'] },
    { id: 'science', label: t('courseTypes.opt-cien'), types: ['opt-cien'] },
    { id: 'lit', label: t('courseTypes.optlet'), types: ['optlet'] },
    { id: 'econ', label: t('courseTypes.econ'), types: ['econ'] },
    { id: 'com', label: t('courseTypes.optcom'), types: ['optcom'] },
    { id: 'astro', label: t('courseTypes.opt-ast'), types: ['opt-ast'] },
    { id: 'bio', label: t('courseTypes.optbio'), types: ['optbio'] }
  ], [t]);

  const filteredCategories = useMemo(() => {
    if (!Array.isArray(filterType)) return categories;
    return categories.filter(cat => 
      cat.id === 'all' || cat.types.some(type => filterType.includes(type))
    );
  }, [categories, filterType]);

  const takenCourseIds = useMemo(() => {
    const ids = new Set<string>();
    state.semesters.forEach(sem => {
      sem.courses.forEach(c => {
        const data = findCourseData(c.id);
        if (data) ids.add(data.id);
      });
    });
    return ids;
  }, [state.semesters, findCourseData]);

  const availableCourses = useMemo(() => {
    return allCourses.filter(c => {
      if (takenCourseIds.has(c.id)) return false;

      if (searchTerm) {
        const lowerTerm = searchTerm.toLowerCase();
        const matchesName = (c.name_stylized || c.name).toLowerCase().includes(lowerTerm);
        const matchesId = c.id.toLowerCase().includes(lowerTerm);
        if (!matchesName && !matchesId) return false;
      }

      const matchesFilter = Array.isArray(filterType) 
        ? filterType.includes(c.type)
        : c.type === filterType;

      if (!matchesFilter) return false;

      if (enableCategories && activeCategory !== 'all') {
        const category = filteredCategories.find(cat => cat.id === activeCategory);
        if (category && !category.types.includes(c.type)) {
          return false;
        }
      }

      return true;
    });
  }, [allCourses, filterType, enableCategories, activeCategory, filteredCategories, takenCourseIds, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t('availableCourses')}</h2>
        <button className={styles.closeButton} onClick={onClose}>×</button>
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
      
      {enableCategories && (
        <div className={styles.categorySection}>
          <div className={styles.categoryTabs}>
            {filteredCategories.map(category => (
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
      )}

      <div className={styles.courseList}>
        {availableCourses.map(course => {
          const colorKey = course.type as keyof typeof currentPalette.colors;
          const color = currentPalette.colors[colorKey] || currentPalette.colors.opt;
          
          return (
            <div 
              key={course.id} 
              className={styles.courseItem}
              style={{ borderLeft: `4px solid ${color}` }}
              onClick={() => {
                onSelect(course);
                onClose();
              }}
            >
              <div className={styles.courseName}>{course.name_stylized || course.name}</div>
              <div className={styles.courseInfo}>
                <span>{course.id}</span>
                <span>{course.cred} {t('credits')}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}