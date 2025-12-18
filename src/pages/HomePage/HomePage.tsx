import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import LanguageToggle from '../../components/LanguageToggle/LanguageToggle';
import styles from './HomePage.module.css';

export default function HomePage() {
  const { t } = useTranslation();
  
  return (
    <div className={styles.body}>
      {/* Elementos de fondo geométricos y luces */}
      <div className={styles.ambientLight}></div>
      <div className={styles.floatingShapes}>
        <div className={styles.shapeCube}></div>
        <div className={styles.shapeSphere}></div>
        <div className={styles.shapePyramid}></div>
        <div className={styles.shapeDiamond}></div>
        <div className={styles.shapeRing}></div>
        <div className={styles.shapeSquare}></div>
        <div className={styles.shapeHexagon}></div>
        <div className={styles.shapeCircle}></div>
      </div>

      <div className={styles.mainContainer}>
        <header className={styles.header}>
             <LanguageToggle />
        </header>
        
        <div className={styles.contentGrid}>
          {/* Sección Hero */}
          <div className={styles.heroSection}>
            <h1 className={styles.title}>
              <span className={styles.titleGradient}>LICCourse</span>
              Planner
            </h1>
            <p className={styles.subtitle}>{t('subtitle')}</p>
            
            <div className={styles.ctaWrapperDesktop}>
                <Link to="/planner" className={styles.ctaButton}>
                {t('goToPlanner')}
                </Link>
            </div>
          </div>

          {/* Sección de Características Desordenadas */}
          <div className={styles.featuresWrapper}>
            <div className={`${styles.featureCard} ${styles.card1}`}>
              <h3>{t('features.dragDrop.title')}</h3>
              <p>{t('features.dragDrop.description')}</p>
            </div>
            <div className={`${styles.featureCard} ${styles.card2}`}>
              <h3>{t('features.prerequisites.title')}</h3>
              <p>{t('features.prerequisites.description')}</p>
            </div>
            <div className={`${styles.featureCard} ${styles.card3}`}>
              <h3>{t('features.edit.title')}</h3>
              <p>{t('features.edit.description')}</p>
            </div>
            <div className={`${styles.featureCard} ${styles.card4}`}>
              <h3>{t('features.create.title')}</h3>
              <p>{t('features.create.description')}</p>
            </div>
          </div>
        </div>
        
        {/* CTA Móvil y Disclaimer */}
        <div className={styles.bottomSection}>
            <div className={styles.ctaWrapperMobile}>
                <Link to="/planner" className={styles.ctaButton}>
                {t('goToPlanner')}
                </Link>
            </div>
        </div>
      </div>

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
            fña🧙‍♂️
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
    </div>
  );
}