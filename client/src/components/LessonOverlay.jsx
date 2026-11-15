import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { getInterestLabel, getProgressKey } from '../data/constants.js';

export default function LessonOverlay({ pathKey, week, topic, codingTrack, onClose }) {
  const { showToast, user, completeLesson, refreshUser } = useAuth();
  const [resources, setResources] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', url: '', type: 'video' });
  const completionKey = getProgressKey(pathKey, week, codingTrack);
  const completed = Boolean(user?.completedLessons?.[completionKey]);

  const load = async () => {
    const { resources: list } = await api.getResources(pathKey, week, codingTrack);
    setResources(list);
  };

  useEffect(() => { load(); }, [pathKey, week, codingTrack]);

  const submit = async () => {
    if (!form.title.trim() || !form.url.trim()) return showToast('Please fill in title and URL.');
    try {
      await api.addResource({ key: pathKey, week, codingTrack, ...form });
      setForm({ title: '', url: '', type: 'video' });
      setShowForm(false);
      await load();
      showToast('Resource added. Thanks for contributing.');
    } catch (err) {
      showToast(err.message);
    }
  };

  const markComplete = async () => {
    try {
      await completeLesson(pathKey, week, codingTrack);
      await refreshUser();
      showToast('Lesson marked as completed.');
    } catch (error) {
      showToast(error.message);
    }
  };

  return (
    <div
      style={{ display: 'flex', position: 'fixed', inset: 0, zIndex: 260, background: 'rgba(0,0,0,.78)', backdropFilter: 'blur(14px)', alignItems: 'flex-start', justifyContent: 'center', padding: '2rem 1rem', overflowY: 'auto' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '28px', width: '100%', maxWidth: '640px', padding: '2.25rem', position: 'relative', margin: 'auto' }}>
        <button type="button" onClick={onClose} style={{ position: 'absolute', top: '1.1rem', right: '1.1rem', background: 'var(--surface2)', border: 'none', width: 34, height: 34, borderRadius: '50%', color: 'var(--muted)', cursor: 'pointer' }}>✕</button>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '.78rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 600, marginBottom: '.3rem' }}>{getInterestLabel(pathKey)} · Week {week}</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{topic}</h2>
        </div>

        <h3 style={{ fontWeight: 700, marginBottom: '.8rem', fontSize: '1rem' }}>Free Resources</h3>
        {resources.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: '.88rem', marginBottom: '.5rem' }}>No resources yet for this week. Be the first to add one!</p>
        ) : (
          resources.map((r, i) => (
            <div key={`${r.url}-${i}`} className="res-card">
              <div style={{ flex: 1 }}>
                <div className="res-title">{r.title}</div>
                <div className="res-meta">{r.type.toUpperCase()} · Shared by {r.by}</div>
              </div>
              <a className="res-link" href={r.url} target="_blank" rel="noopener noreferrer">Open →</a>
            </div>
          ))
        )}

        <button type="button" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: '.5rem' }} onClick={() => setShowForm(!showForm)}>+ Add a Resource</button>

        <div className={`add-res-form${showForm ? ' show' : ''}`}>
          <div className="form-group"><label>Title</label><input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Beginner's Guide to..." /></div>
          <div className="form-group"><label>URL</label><input type="text" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." /></div>
          <div className="form-group">
            <label>Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="video">Video</option>
              <option value="pdf">PDF</option>
              <option value="article">Article</option>
            </select>
          </div>
          <button type="button" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={submit}>Submit Resource</button>
        </div>

        <button type="button" className={`btn ${completed ? 'btn-completed' : 'btn-success'}`} style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem' }} onClick={markComplete} disabled={completed}>
          {completed ? '✓ Lesson Completed' : 'Mark Lesson as Completed'}
        </button>
        <button type="button" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: '.75rem' }} onClick={onClose}>← Back to Path</button>
      </div>
    </div>
  );
}
