import { Route, Routes } from 'react-router-dom';
import TrackerPage from './pages/TrackerPage';
import AnalyzePage from './pages/AnalyzePage';
import AboutPage from './pages/AboutPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TrackerPage />} />
      <Route path="/analyze" element={<AnalyzePage />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
}
