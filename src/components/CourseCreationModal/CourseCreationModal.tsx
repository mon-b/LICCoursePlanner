import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Course, CourseType } from '../../types/course';
import styles from './CourseCreationModal.module.css';

interface CourseCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCourse: (course: Course) => void;
}

export default function CourseCreationModal({ isOpen, onClose, onCreateCourse }: CourseCreationModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [credits, setCredits] = useState('');
  const [type, setType] = useState<CourseType | ''>('');
  
  useEffect(() => {
    if (!isOpen) {
      setName('');
      setId('');
      setCredits('');
      setType('');
    }
  }, [isOpen]);
  
  const courseTypes: { value: CourseType; label: string }[] = [
    { value: 'fmat', label: t('courseTypes.fmat') },
    { value: 'dcc', label: t('courseTypes.dcc') },
    { value: 'major', label: t('courseTypes.major') },
    { value: 'ofg', label: t('courseTypes.ofg') },
    { value: 'eti', label: t('courseTypes.eti') },
    { value: 'optcomp', label: t('courseTypes.optcomp') },
    { value: 'opt-cien', label: t('courseTypes.opt-cien') },
    { value: 'optcom', label: t('courseTypes.optcom') },
    { value: 'opt-mat', label: t('courseTypes.opt-mat') },
    { value: 'optlet', label: t('courseTypes.optlet') },
    { value: 'econ', label: t('courseTypes.econ') },
    { value: 'opt-ast', label: t('courseTypes.opt-ast') },
    { value: 'optbio', label: t('courseTypes.optbio') },
    { value: 'engdiag', label: t('courseTypes.engdiag') },
    { value: 'engcour', label: t('courseTypes.engcour') }
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !id || !credits || !type) {
      return;
    }
    
    const course: Course = {
      id: id.toUpperCase(),
      name: name.toUpperCase(),
      name_english: name,
      name_stylized: name,
      prereq: null,
      cred: credits,
      type: type as CourseType,
      parity: 'both',
      hide: false
    };
    
    onCreateCourse(course);
  };
  
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  const modalContent = (
    <div 
      className={`${styles.modalOverlay} ${isOpen ? styles.visible : ''}`} 
      onClick={handleOverlayClick}
    >
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose} type="button">
          &times;
        </button>
        <h2 className={styles.modalTitle}>{t('createCourse')}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formElement}>
            <input
              type="text"
              className={styles.input}
              placeholder={t('courseName')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
          
          <div className={styles.formElement}>
            <input
              type="text"
              className={styles.input}
              placeholder={t('courseCode')}
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </div>
          
          <div className={styles.formElement}>
            <input
              type="number"
              className={styles.input}
              placeholder={t('courseCredits')}
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              min="1"
              max="20"
              required
            />
          </div>
          
          <div className={styles.formElement}>
            <select
              className={styles.select}
              value={type}
              onChange={(e) => setType(e.target.value as CourseType)}
              required
            >
              <option value="" disabled>{t('selectCourseType')}</option>
              {courseTypes.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          
          <button type="submit" className={styles.createButton}>
            {t('createCourse')}
          </button>
        </form>
      </div>
    </div>
  );
  
  return createPortal(modalContent, document.body);
}