const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

function getToken() {
  return localStorage.getItem('pathmind_token');
}

export function setToken(token) {
  if (token) localStorage.setItem('pathmind_token', token);
  else localStorage.removeItem('pathmind_token');
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch {
    const err = new Error('The learning server is unavailable. Check that npm run dev is running, then try again.');
    err.code = 'network_error';
    throw err;
  }
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.error || 'Request failed');
    err.status = res.status;
    err.code = data.error;
    throw err;
  }

  return data;
}

export const api = {
  health: () => request('/health'),
  signup: (body) => request('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),
  updateInterests: (body) => request('/users/interests', { method: 'PUT', body: JSON.stringify(body) }),
  completeLesson: (body) => request('/users/lesson-complete', { method: 'POST', body: JSON.stringify(body) }),
  completeProject: (body) => request('/users/project-complete', { method: 'POST', body: JSON.stringify(body) }),
  submitExam: (body) => request('/users/exam-result', { method: 'POST', body: JSON.stringify(body) }),
  getQuestions: (topic, instrument, week, codingTrack) => {
    const params = new URLSearchParams();
    if (instrument) params.set('instrument', instrument);
    if (week) params.set('week', week);
    if (codingTrack) params.set('codingTrack', codingTrack);
    const q = params.toString() ? `?${params.toString()}` : '';
    return request(`/exams/questions/${encodeURIComponent(topic)}${q}`);
  },
  getResources: (key, week, codingTrack) => {
    const track = codingTrack ? `?codingTrack=${encodeURIComponent(codingTrack)}` : '';
    return request(`/resources/${encodeURIComponent(key)}/${week}${track}`);
  },
  addResource: (body) => request('/resources', { method: 'POST', body: JSON.stringify(body) }),
  getNearbyCoaches: (latitude, longitude) => request(`/coaches/nearby?lat=${latitude}&lng=${longitude}`),
};
