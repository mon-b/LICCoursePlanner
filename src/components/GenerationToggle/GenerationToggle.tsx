import { useState, useRef, useEffect } from 'react';
import { useCoursePlanner, GENERATIONS } from '../../context/CoursePlannerContext';
import styles from './GenerationToggle.module.css';

export default function GenerationToggle() {
  const { currentGeneration, switchGeneration } = useCoursePlanner();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedGen = GENERATIONS.find(g => g.id === currentGeneration) || GENERATIONS[0];

  const handleGenChange = (genId: string) => {
    switchGeneration(genId);
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
    <div className={styles.paletteContainer} ref={dropdownRef} title="Seleccionar Generación">
      <div className={styles.customSelect}>
        <button 
          className={styles.selectButton}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={styles.selectedText}>
            {selectedGen.name}
          </span>
          <span className={`${styles.arrow} ${isOpen ? styles.arrowUp : ''}`}>
            ▼
          </span>
        </button>
        
        {isOpen && (
          <div className={styles.optionsContainer}>
            {GENERATIONS.map(gen => (
              <button
                key={gen.id}
                className={`${styles.option} ${gen.id === currentGeneration ? styles.optionSelected : ''}`}
                onClick={() => handleGenChange(gen.id)}
              >
                <span className={styles.optionText}>
                  {gen.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}