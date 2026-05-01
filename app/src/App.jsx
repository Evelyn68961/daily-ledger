import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Route, Routes } from 'react-router-dom';
import TrackerPage from './pages/TrackerPage';
import AnalyzePage from './pages/AnalyzePage';
import AboutPage from './pages/AboutPage';
import { migrateLegacyEntries } from './storage';

export default function App() {
  const qc = useQueryClient();
  const ranOnce = useRef(false);

  useEffect(() => {
    if (ranOnce.current) return;
    ranOnce.current = true;
    migrateLegacyEntries()
      .then((result) => {
        if (result?.migrated > 0) {
          qc.invalidateQueries({ queryKey: ['entries'] });
        }
      })
      .catch((err) => {
        console.warn('legacy migration deferred (backend unreachable):', err.message);
      });
  }, [qc]);

  return (
    <Routes>
      <Route path="/" element={<TrackerPage />} />
      <Route path="/analyze" element={<AnalyzePage />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
}
