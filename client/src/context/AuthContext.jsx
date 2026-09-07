import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, setToken } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3200);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { user: u } = await api.me();
      setUser(u);
      return u;
    } catch {
      setUser(null);
      setToken(null);
      return null;
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (!localStorage.getItem('pathmind_token')) {
        setLoading(false);
        return;
      }
      await refreshUser();
      setLoading(false);
    })();
  }, [refreshUser]);

  const login = async (email, password) => {
    const { user: u, token } = await api.login({ email, password });
    setToken(token);
    setUser(u);
    return u;
  };

  const signup = async (payload) => {
    const { user: u, token } = await api.signup(payload);
    setToken(token);
    setUser(u);
    return u;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const updateInterests = async (interests, instrument, codingTrack, codingTracks) => {
    const { user: u } = await api.updateInterests({ interests, instrument, codingTrack, codingTracks });
    setUser(u);
    return u;
  };

  const completeLesson = async (key, week, codingTrack) => {
    const { user: u } = await api.completeLesson({ key, week, codingTrack });
    setUser(u);
    return u;
  };

  const completeProject = async (key, week, project) => {
    const { user: u } = await api.completeProject({ key, week, ...project });
    setUser(u);
    return u;
  };

  const submitExamResult = async (result) => {
    const { user: u } = await api.submitExam(result);
    setUser(u);
    return u;
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      toast,
      showToast,
      login,
      signup,
      logout,
      refreshUser,
      updateInterests,
      completeLesson,
      completeProject,
      submitExamResult,
    }),
    [user, loading, toast, showToast, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
