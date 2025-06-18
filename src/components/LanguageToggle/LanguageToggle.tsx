import { useTranslation } from 'react-i18next';
import styles from './LanguageToggle.module.css';

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };
  
  return (
    <button className={styles.languageToggle} onClick={toggleLanguage}>
      {i18n.language === 'en' ? '🇨🇱 ES' : '🇬🇧 EN'}
    </button>
  );
}