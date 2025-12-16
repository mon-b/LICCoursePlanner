import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Course } from '../../types/course';
import styles from './CourseEditor.module.css';

interface CourseEditorProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (originalId: string, updatedCourse: Course) => void;
}

export default function CourseEditor({ course, isOpen, onClose, onSave }: CourseEditorProps) {
  const { t } = useTranslation();
  const [editedCourse, setEditedCourse] = useState<Course | null>(null);

  useEffect(() => {
    if (course) {
      setEditedCourse({ ...course });
    }
  }, [course]);

  if (!isOpen || !editedCourse) return null;

  const handleChange = (field: keyof Course, value: any) => {
    setEditedCourse(prev => prev ? ({ ...prev, [field]: value }) : null);
  };

  const handleSave = () => {
    if (editedCourse && course) {
      onSave(course.id, editedCourse);
      onClose();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t('editCourse')}</h2>
        <button className={styles.closeButton} onClick={onClose}>×</button>
      </div>
      <div className={styles.content}>
        <div className={styles.formGroup}>
          <label className={styles.label}>{t('courseName')}</label>
          <input
            className={styles.input}
            value={editedCourse.name_stylized || editedCourse.name}
            onChange={(e) => {
               handleChange('name_stylized', e.target.value);
               handleChange('name', e.target.value);
            }}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>{t('courseCode')}</label>
          <input
            className={styles.input}
            value={editedCourse.id}
            onChange={(e) => handleChange('id', e.target.value)}
          />
        </div>
        
        <div className={styles.formGroup}>
            <label className={styles.label}>{t('courseCredits')}</label>
            <input
                className={styles.input}
                type="number"
                value={editedCourse.cred}
                onChange={(e) => handleChange('cred', e.target.value)}
            />
        </div>

        <button className={styles.saveButton} onClick={handleSave}>
          {t('save')}
        </button>
      </div>
    </div>
  );
}