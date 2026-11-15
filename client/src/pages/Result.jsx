import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getInterestLabel } from '../data/constants.js';

export default function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state) navigate('/dashboard', { replace: true });
  }, [state, navigate]);

  if (!state) return null;

  const { score, correct, wrong, writtenSubmitted, timeStr, topic, week, codingTrack } = state;
  const title = score >= 80 ? 'Outstanding!' : score >= 60 ? 'Well Done!' : score >= 40 ? 'Keep Going!' : "Don't Give Up!";
  const msg = score >= 80
    ? 'Exceptional performance! A badge has been added to your profile and your learning path has been advanced.'
    : score >= 60
      ? "You passed this week's exam! Keep up the momentum and aim even higher next time."
      : score >= 40
        ? 'A good attempt! Review the areas where you lost marks and come back stronger.'
        : "Every expert was once a beginner. Review your learning path and retake the exam — you've got this!";

  useEffect(() => {
    const rf = document.getElementById('ringFill');
    if (rf) {
      rf.style.stroke = score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--accent)' : score >= 40 ? '#fc5c7d' : '#666';
      rf.style.strokeDashoffset = 377;
      setTimeout(() => { rf.style.strokeDashoffset = 377 - ((score / 100) * 377); }, 100);
    }
  }, [score]);

  return (
    <div className="page active">
      <div className="result-container">
        <div className="result-topic">{getInterestLabel(topic)} · Week {week}</div>
        <h2 className="result-title">{title}</h2>
        <div className="result-score-ring">
          <svg width="150" height="150" viewBox="0 0 150 150">
            <circle className="ring-bg" cx="75" cy="75" r="60" />
            <circle className="ring-fill" id="ringFill" cx="75" cy="75" r="60" strokeDasharray="377" strokeDashoffset="377" />
          </svg>
          <div className="ring-label">
            <div className="ring-pct">{score}%</div>
            <div className="ring-sub">Score</div>
          </div>
        </div>
        <div className="result-stats">
          <div className="rs-card"><div className="rs-num" style={{ color: 'var(--success)' }}>{correct}</div><div className="rs-label">Correct</div></div>
          <div className="rs-card"><div className="rs-num" style={{ color: 'var(--accent2)' }}>{wrong}</div><div className="rs-label">Wrong</div></div>
          <div className="rs-card"><div className="rs-num" style={{ color: 'var(--accent3)' }}>{writtenSubmitted || 0}/2</div><div className="rs-label">Written submitted</div></div>
          <div className="rs-card"><div className="rs-num" style={{ color: 'var(--accent)' }}>{timeStr}</div><div className="rs-label">Time Taken</div></div>
        </div>
        <p className="result-msg">{msg} Written responses are pending review and are not marked correct automatically.</p>
        <div className="result-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/dashboard')}>← Dashboard</button>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/exam', { state: { topic, week, codingTrack } })}>Retake Assessment</button>
        </div>
      </div>
    </div>
  );
}
