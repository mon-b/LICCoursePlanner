import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { CoursePlannerProvider } from './context/CoursePlannerContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/config';
import HomePage from './pages/HomePage/HomePage';
import PlannerPage from './pages/PlannerPage/PlannerPage';
import './App.css';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <CoursePlannerProvider>
        <BrowserRouter basename="/LICCoursePlanner">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/planner" element={<PlannerPage />} />
          </Routes>
        </BrowserRouter>
      </CoursePlannerProvider>
    </I18nextProvider>
  );
}

export default App;