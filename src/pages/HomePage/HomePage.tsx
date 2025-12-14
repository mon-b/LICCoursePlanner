import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import LanguageToggle from '../../components/LanguageToggle/LanguageToggle';
import styles from './HomePage.module.css';

export default function HomePage() {
  const { t } = useTranslation();
  
  return (
    <div className={styles.body}>
      <div className={styles.backgroundGradient}></div>
      <div className={styles.backgroundOrbs}>
        <div className={styles.orb1}></div>
        <div className={styles.orb2}></div>
        <div className={styles.orb3}></div>
      </div>

      <div className={styles.container}>
        <div className={styles.languageContainer}>
            <LanguageToggle />
        </div>
        
        <div className={styles.hero}>
          <h1>{t('title')}</h1>
          <p>{t('subtitle')}</p>
        </div>

        <div className={styles.features}>
          <div className={styles.featureCard}>
            <h3>{t('features.dragDrop.title')}</h3>
            <p>{t('features.dragDrop.description')}</p>
          </div>
          <div className={styles.featureCard}>
            <h3>{t('features.prerequisites.title')}</h3>
            <p>{t('features.prerequisites.description')}</p>
          </div>
          <div className={styles.featureCard}>
            <h3>{t('features.classification.title')}</h3>
            <p>{t('features.classification.description')}</p>
          </div>
        </div>
        
        <Link to="/planner" className={styles.ctaButton}>
          {t('goToPlanner')}
        </Link>

        <div className={styles.disclaimerContainer}>
          <div className={styles.disclaimerContent}>
            <span className={styles.disclaimerIcon}>⚠️</span>
            <p>{t('disclaimer')}</p>
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