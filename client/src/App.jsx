import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Nav from './components/Nav.jsx';
import Toast from './components/Toast.jsx';
import MeshBackground from './components/MeshBackground.jsx';
import AuthModal from './components/AuthModal.jsx';
import Landing from './pages/Landing.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Exam from './pages/Exam.jsx';
import Result from './pages/Result.jsx';
import { useEffect, useState } from 'react';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page active" style={{ justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
  if (!user) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const [authModal, setAuthModal] = useState(null);
  const [theme, setTheme] = useState(() => (
    localStorage.getItem('pathmind-theme') === 'dark' ? 'dark' : 'light'
  ));

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('pathmind-theme', theme);
  }, [theme]);

  return (
    <>
      <MeshBackground />
      <Nav
        onOpenAuth={setAuthModal}
        theme={theme}
        onToggleTheme={() => setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))}
      />
      <div id="app">
        <Routes>
          <Route path="/" element={<Landing onOpenAuth={setAuthModal} />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exam"
            element={
              <ProtectedRoute>
                <Exam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/result"
            element={
              <ProtectedRoute>
                <Result />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {authModal && <AuthModal tab={authModal} onClose={() => setAuthModal(null)} />}
      <Toast />
    </>
  );
}
