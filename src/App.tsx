import { Routes, Route, BrowserRouter, useLocation } from 'react-router-dom';
import { CoursePlannerProvider } from './context/CoursePlannerContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/config';
import HomePage from './pages/HomePage/HomePage';
import PlannerPage from './pages/PlannerPage/PlannerPage';
import { AnimatePresence } from 'framer-motion';
import './App.css';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/planner" element={<PlannerPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <CoursePlannerProvider>
        <BrowserRouter basename="/LICCoursePlanner">
          <AnimatedRoutes />
        </BrowserRouter>
      </CoursePlannerProvider>
    </I18nextProvider>
  );
}

export default App;