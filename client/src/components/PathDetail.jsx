import { useState } from 'react';
import { getPathDisplay, getPathProgress, getWeekList } from '../data/constants.js';
import LessonOverlay from './LessonOverlay.jsx';

export default function PathDetail({ pathKey, prog, weeks, codingTrack: selectedCodingTrack, user, onClose, onStartExam, onCreateProject }) {
  const [lesson, setLesson] = useState(null);
  const codingTrack = selectedCodingTrack || user.codingTrack;
  const { displayKey, desc, emoji } = getPathDisplay(pathKey, user.instrument, codingTrack);
  const weekList = getWeekList(pathKey, user.instrument, codingTrack);
  const currentProgress = getPathProgress(user.email, pathKey, user.examHistory, user.completedLessons, user.completedProjects, codingTrack);
  const currentProg = currentProgress.prog;
  const currentWeek = currentProgress.weeks;

  return (
    <>
      <div
        style={{ display: 'flex', position: 'fixed', inset: 0, zIndex: 250, background: 'rgba(0,0,0,.78)', backdropFilter: 'blur(14px)', alignItems: 'flex-start', justifyContent: 'center', padding: '2rem 1rem', overflowY: 'auto' }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '28px', width: '100%', maxWidth: '680px', padding: '2.25rem', position: 'relative', margin: 'auto' }}>
          <button type="button" onClick={onClose} style={{ position: 'absolute', top: '1.1rem', right: '1.1rem', background: 'var(--surface2)', border: 'none', width: 34, height: 34, borderRadius: '50%', color: 'var(--muted)', cursor: 'pointer' }}>✕</button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
            <div style={{ fontSize: '3rem' }}>{emoji}</div>
            <div>
              <h2 style={{ fontSize: '1.7rem', fontWeight: 800, marginBottom: '.25rem' }}>{displayKey}</h2>
              <p style={{ color: 'var(--muted)', fontSize: '.9rem' }}>{desc}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.75rem' }}>
            <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent)' }}>{currentProg}%</div>
              <div style={{ fontSize: '.78rem', color: 'var(--muted)' }}>Progress</div>
            </div>
            <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent2)' }}>Wk {currentWeek}</div>
              <div style={{ fontSize: '.78rem', color: 'var(--muted)' }}>Current Week</div>
            </div>
            <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent3)' }}>12</div>
              <div style={{ fontSize: '.78rem', color: 'var(--muted)' }}>Total Weeks</div>
            </div>
          </div>

          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>📅 12-Week Curriculum</h3>
          {weekList.map((topic, i) => {
            const wNum = i + 1;
            const done = wNum < currentWeek;
            const current = wNum === currentWeek;
            const icon = done ? '✅' : current ? '▶️' : '🔒';
            const status = done ? 'Completed' : current ? 'In Progress' : 'Locked';
            const sCol = done ? 'var(--accent3)' : current ? 'var(--accent2)' : 'var(--muted)';
            const border = current ? 'var(--accent)' : 'var(--border)';
            return (
              <div key={wNum} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '.9rem 1.1rem', background: 'var(--surface2)', borderRadius: '14px', border: `1px solid ${border}`, marginBottom: '.6rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '.95rem' }}>Week {wNum}: {topic}</div>
                  <div style={{ fontSize: '.78rem', color: sCol, marginTop: '.15rem' }}>{status}</div>
                </div>
                {current && (
                    <button type="button" className="btn btn-primary" style={{ fontSize: '.78rem', padding: '.35rem .9rem', borderRadius: '8px' }} onClick={() => setLesson({ pathKey, week: wNum, topic, codingTrack })}>
                    Start →
                  </button>
                )}
                {wNum === 12 && current && (
                  <button type="button" className="btn btn-success" style={{ fontSize: '.78rem', padding: '.35rem .9rem', borderRadius: '8px' }} onClick={() => onCreateProject(pathKey, 12, topic, codingTrack)}>
                    Create final project
                  </button>
                )}
              </div>
            );
          })}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => onStartExam(pathKey, currentWeek, codingTrack)}>📝 Take Week {currentWeek} Assessment →</button>
            <button type="button" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>← Back to Dashboard</button>
          </div>
        </div>
      </div>

      {lesson && <LessonOverlay {...lesson} onClose={() => setLesson(null)} />}
    </>
  );
}
