import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCoursePlanner } from '../../context/CoursePlannerContext';
import styles from './PaletteToggle.module.css';

export default function PaletteToggle() {
  const { t } = useTranslation();
  const { dispatch, getCurrentPalette, getAvailablePalettes } = useCoursePlanner();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const currentPalette = getCurrentPalette();
  const availablePalettes = getAvailablePalettes();

  const handlePaletteChange = (paletteId: string) => {
    dispatch({ 
      type: 'SET_PALETTE', 
      payload: { paletteId } 
    });
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.paletteContainer} ref={dropdownRef}>
      <span className={styles.paletteIcon}>🎨</span>
      <div className={styles.customSelect}>
        <button 
          className={styles.selectButton}
          onClick={() => setIsOpen(!isOpen)}
          title={t('choosePalette')}
        >
          <span className={styles.selectedText}>
            {t(`palettes.${currentPalette.id}`)}
          </span>
          <span className={`${styles.arrow} ${isOpen ? styles.arrowUp : ''}`}>
            ▼
          </span>
        </button>
        
        {isOpen && (
          <div className={styles.optionsContainer}>
            {availablePalettes.map(palette => (
              <button
                key={palette.id}
                className={`${styles.option} ${palette.id === currentPalette.id ? styles.optionSelected : ''}`}
                onClick={() => handlePaletteChange(palette.id)}
              >
                <span className={styles.optionText}>
                  {t(`palettes.${palette.id}`)}
                </span>
                {palette.id === currentPalette.id && (
                  <span className={styles.checkmark}>✓</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}