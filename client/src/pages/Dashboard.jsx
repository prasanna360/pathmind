import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api/client.js';
import {
  coaches,
  INTERESTS,
  examTopicLabels,
  getPathDisplay,
  getProgressKey,
  getPathProgress,
  getWeekList,
  normalizeInterest,
} from '../data/constants.js';
import PathDetail from '../components/PathDetail.jsx';
import EditInterests from '../components/EditInterests.jsx';
import LessonOverlay from '../components/LessonOverlay.jsx';

export default function Dashboard() {
  const { user, showToast, completeProject } = useAuth();
  const navigate = useNavigate();
  const [pathDetail, setPathDetail] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [locationStatus, setLocationStatus] = useState('idle');
  const [userLocation, setUserLocation] = useState(null);
  const [liveCoaches, setLiveCoaches] = useState([]);
  const [todayLesson, setTodayLesson] = useState(null);
  const [projectSaving, setProjectSaving] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectForm, setProjectForm] = useState({ title: '', description: '', url: '' });
  const [projectContext, setProjectContext] = useState(null);
  const [coachFilter, setCoachFilter] = useState('All');

  if (!user) return null;

  const fn = user.name.split(' ')[0];
  const hist = user.examHistory || [];
  const savedInterests = (user.interests || []).map(normalizeInterest).filter((interest) => INTERESTS.includes(interest));
  const interests = savedInterests.length ? savedInterests : ['🎸 Music'];
  const codingTracks = user.codingTracks?.length ? user.codingTracks : [user.codingTrack || 'Web Development'];
  const pathCards = interests.flatMap((key) => key === '💻 Coding' ? codingTracks.map((codingTrack) => ({ key, codingTrack })) : [{ key, codingTrack: undefined }]);
  const todayPath = interests[0];
  const todayCodingTrack = todayPath === '💻 Coding' ? codingTracks[0] : undefined;
  const todayProgress = getPathProgress(user.email, todayPath, hist, user.completedLessons, user.completedProjects, todayCodingTrack);
  const todayTopic = getWeekList(todayPath, user.instrument, todayCodingTrack)[todayProgress.weeks - 1] || 'Your next lesson';
  const projectId = getProgressKey(todayPath, todayProgress.weeks, todayCodingTrack);
  const projectDone = Boolean(user.completedProjects?.[projectId]);
  const activeProject = projectContext || { pathKey: todayPath, week: todayProgress.weeks, topic: todayTopic };

  const openProjectForm = (pathKey = todayPath, week = todayProgress.weeks, topic = todayTopic, codingTrack = todayCodingTrack) => {
    setProjectContext({ pathKey, week, topic, codingTrack: pathKey === '💻 Coding' ? codingTrack : undefined });
    setProjectForm({ title: '', description: '', url: '' });
    setShowProjectForm(true);
  };

  const markProjectComplete = async (event) => {
    event.preventDefault();
    setProjectSaving(true);
    try {
      await completeProject(activeProject.pathKey, activeProject.week, { ...projectForm, codingTrack: activeProject.codingTrack });
      setProjectForm({ title: '', description: '', url: '' });
      setShowProjectForm(false);
      showToast('✅ Project added to your portfolio!');
    } catch (error) {
      showToast(`⚠️ ${error.message}`);
    } finally {
      setProjectSaving(false);
    }
  };
  const nearbyCoaches = useMemo(() => {
    if (!userLocation) {
      const filtered = coachFilter === 'All' ? coaches : coaches.filter((coach) => coach.s.toLowerCase().includes(coachFilter.toLowerCase()));
      return filtered.slice(0, 4);
    }
    return liveCoaches.slice(0, 4);
  }, [coachFilter, liveCoaches, userLocation]);

  useEffect(() => {
    if (!userLocation) return;
    let cancelled = false;
    api.getNearbyCoaches(userLocation.lat, userLocation.lng)
      .then(({ centers, fallback }) => {
        if (!cancelled) {
          setLiveCoaches(centers);
          setLocationStatus(fallback ? 'fallback' : centers.length ? 'ready' : 'empty');
        }
      })
      .catch(() => {
        if (!cancelled) setLocationStatus('error');
      });
    return () => { cancelled = true; };
  }, [userLocation]);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('unsupported');
      return;
    }
    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserLocation({ lat: coords.latitude, lng: coords.longitude });
        setLiveCoaches([]);
        setLocationStatus('loading');
      },
      () => setLocationStatus('denied'),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  };

  const startExam = (topic, week, codingTrack) => {
    navigate('/exam', { state: { topic, week, codingTrack } });
  };

  return (
    <div className="page active">
      <div className="dash-inner">
        <div className="dash-welcome">
          <div>
            <div className="dash-greeting">Welcome back, <span>{fn}</span> 👋</div>
            <div className="dash-meta">
              {interests.join(' · ')} · {user.freeTime || 60} min/day · {user.skillLevel || 'Beginner'}
              {user.goal ? ` · Goal: ${user.goal}` : ''}
            </div>
          </div>
          <button type="button" className="btn btn-outline" onClick={() => setShowEdit(true)}>⚙️ Edit Interests</button>
        </div>

        {projectDone && typeof user.completedProjects[projectId] === 'object' && (
          <section className="portfolio-card">
            <div className="today-kicker">YOUR PORTFOLIO</div>
            <h2>{user.completedProjects[projectId].title}</h2>
            <p>{user.completedProjects[projectId].description}</p>
            {user.completedProjects[projectId].url && <a href={user.completedProjects[projectId].url} target="_blank" rel="noreferrer">Open submitted work →</a>}
          </section>
        )}

        {showProjectForm && (
          <div className="project-form-panel">
            <div className="today-kicker">CREATE YOUR PROJECT</div>
            <h2>Show what you learned</h2>
            <p>Describe the work you completed for Week {activeProject.week}. You can add a link to a live demo, recording, or portfolio.</p>
            <form onSubmit={markProjectComplete}>
              <div className="form-group"><label htmlFor="project-title">Project title</label><input id="project-title" required maxLength={100} value={projectForm.title} onChange={(event) => setProjectForm({ ...projectForm, title: event.target.value })} placeholder={activeProject.topic} /></div>
              <div className="form-group"><label htmlFor="project-description">What did you make?</label><textarea id="project-description" required minLength={10} maxLength={500} rows={4} value={projectForm.description} onChange={(event) => setProjectForm({ ...projectForm, description: event.target.value })} placeholder="Explain what you practised and what you created." /></div>
              <div className="form-group"><label htmlFor="project-url">Work link (optional)</label><input id="project-url" type="url" value={projectForm.url} onChange={(event) => setProjectForm({ ...projectForm, url: event.target.value })} placeholder="https://..." /></div>
              <div className="project-form-actions"><button type="button" className="btn btn-outline" onClick={() => setShowProjectForm(false)}>Cancel</button><button type="submit" className="btn btn-success" disabled={projectSaving}>{projectSaving ? 'Saving...' : 'Save to portfolio'}</button></div>
            </form>
          </div>
        )}

        <section className="today-focus">
          <div>
            <div className="today-kicker">TODAY&apos;S FOCUS</div>
            <h2>{todayTopic}</h2>
            <p>{todayPath} · Week {todayProgress.weeks} · A focused session designed for your {user.freeTime || 60}-minute day.</p>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setTodayLesson({ pathKey: todayPath, week: todayProgress.weeks, topic: todayTopic, codingTrack: todayCodingTrack })}>
            Start today&apos;s lesson →
          </button>
        </section>

        <div className="exam-card">
          <div className="exam-info">
            <h3>📝 Weekly Skill Assessment</h3>
            <p>10 knowledge checks + 2 written responses · Results saved instantly</p>
            <div className="exam-chips">
              {pathCards.map(({ key, codingTrack }) => (
                <span key={`${key}-${codingTrack || 'default'}`} className="exam-chip" onClick={() => startExam(key, getPathProgress(user.email, key, hist, user.completedLessons, user.completedProjects, codingTrack).weeks, codingTrack)} role="button" tabIndex={0}>
                  {codingTrack ? `${codingTrack} Assessment` : examTopicLabels[key] || 'General'}
                </span>
              ))}
            </div>
          </div>
        </div>

        {hist.length > 0 && (
          <div className="exam-history">
            <div className="path-header"><h2>📊 Past Exam Results</h2></div>
            <div className="exam-hist-grid">
              {[...hist].reverse().slice(0, 6).map((h, i) => {
                const pass = h.score >= 60;
                const bar = pass ? 'linear-gradient(90deg,#1aff8c,#00c97a)' : 'linear-gradient(90deg,var(--accent2),#ff8c5c)';
                return (
                  <div key={`${h.date}-${i}`} className="exam-hist-card">
                    <div className="eh-topic">{h.topic}</div>
                    <div className={`eh-score ${pass ? 'pass' : 'fail'}`}>{h.score}%</div>
                    <div style={{ fontSize: '.78rem', color: 'var(--muted)' }}>{h.correct} knowledge checks correct · {h.timeTaken}</div>
                    <div className="eh-date">{new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    <div className="progress-bar" style={{ marginTop: '.6rem' }}><div className="progress-fill" style={{ width: `${h.score}%`, background: bar }} /></div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="path-header"><h2>Your Learning Paths</h2></div>
        <div className="path-grid">
          {pathCards.map(({ key, codingTrack }) => {
            const { prog, weeks } = getPathProgress(user.email, key, hist, user.completedLessons, user.completedProjects, codingTrack);
            const { displayKey, desc, emoji } = getPathDisplay(key, user.instrument, codingTrack);
            return (
              <div
                key={`${key}-${codingTrack || 'default'}`}
                className="path-card"
                style={{ cursor: 'pointer' }}
                onClick={() => setPathDetail({ pathKey: key, prog, weeks, codingTrack })}
                role="button"
                tabIndex={0}
              >
                <div className="path-emoji">{emoji}</div>
                <div className="path-title">{displayKey}</div>
                <div className="path-desc">{desc}</div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${prog}%` }} /></div>
                <div className="path-meta"><span>{prog}% complete</span><span>Week {weeks} of 12</span></div>
                <div style={{ marginTop: '.75rem', display: 'inline-flex', alignItems: 'center', gap: '.35rem', fontSize: '.8rem', color: 'var(--accent)', fontWeight: 600 }}>Open Path →</div>
              </div>
            );
          })}
        </div>

        <div className="coaches-section">
          <div className="location-header">
            <div className="path-header"><h2>Nearby Coach Centres 📍</h2><p className="location-note">{locationStatus === 'ready' ? 'Live centres near your current location' : locationStatus === 'fallback' ? 'Showing PathMind directory while live search is unavailable' : 'Use your location to find real centres nearby'}</p></div>
            <div className="location-actions">
              {!userLocation && <select className="coach-filter" value={coachFilter} onChange={(event) => setCoachFilter(event.target.value)} aria-label="Filter coaches by interest"><option value="All">All skills</option>{interests.map((interest) => <option key={interest} value={interest.split(' ').slice(1).join(' ')}>{interest}</option>)}</select>}
              <button type="button" className="btn btn-outline location-button" onClick={detectLocation} disabled={locationStatus === 'loading'}>
                {locationStatus === 'loading' ? 'Finding you...' : locationStatus === 'ready' ? '↻ Update location' : '⌖ Use my location'}
              </button>
            </div>
          </div>
          {locationStatus === 'denied' && <p className="location-error">Location permission was blocked. Allow it in your browser settings and try again.</p>}
          {locationStatus === 'unsupported' && <p className="location-error">Your browser does not support location detection.</p>}
          {locationStatus === 'error' && <p className="location-error">Live centres could not be loaded. Please try again.</p>}
          {locationStatus === 'empty' && <p className="location-error location-success">No mapped coaching centres were found nearby.</p>}
          <div className="coach-grid">
            {nearbyCoaches.map((c) => (
              <div key={c.id || c.n} className="coach-card" onClick={() => c.mapUrl ? window.open(c.mapUrl, '_blank', 'noopener,noreferrer') : showToast(`📍 Contacting ${c.n}…`)} role="button" tabIndex={0}>
                <div className="coach-avatar">{c.e}</div>
                <div>
                  <div className="coach-name">{c.n}</div>
                  <div className="coach-skill">{c.s}</div>
                  <div className="coach-info">{c.i}{c.distance !== undefined ? ` · ${c.distance.toFixed(1)} km away` : ''}</div>
                  {c.mapUrl ? <a className="coach-badge coach-map-link" href={c.mapUrl} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()}>{c.b}</a> : <div className="coach-badge">{c.b}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {pathDetail && (
        <PathDetail
          {...pathDetail}
          user={user}
          onClose={() => setPathDetail(null)}
          onStartExam={startExam}
          onCreateProject={(pathKey, week, topic, codingTrack) => {
            setPathDetail(null);
            openProjectForm(pathKey, week, topic, codingTrack);
          }}
        />
      )}
      {showEdit && <EditInterests onClose={() => setShowEdit(false)} />}
      {todayLesson && <LessonOverlay {...todayLesson} onClose={() => setTodayLesson(null)} />}
    </div>
  );
}
