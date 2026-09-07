import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { INTERESTS } from '../data/constants.js';

export default function Landing({ onOpenAuth }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  return (
    <div className="page active">
      <section className="hero-shell">
        <div className="hero-copy">
          <div className="hero-badge">✦ AI-Powered Learning for Ages 18–35</div>
          <h1 className="hero-title">Learn Anything.<br /><span>At Your Own Pace.</span></h1>
          <p className="hero-sub">
            Personalized AI Learning Path crafts a personalized learning journey just for you — around your free
            time, your skill level, and your goals. No pressure. Just progress.
          </p>
          <div className="hero-cta">
            <button type="button" className="btn btn-primary" style={{ fontSize: '1rem', padding: '.85rem 2rem' }} onClick={() => onOpenAuth('signup')}>Start Your Journey →</button>
            <button type="button" className="btn btn-outline" style={{ fontSize: '1rem', padding: '.85rem 2rem' }} onClick={() => onOpenAuth('login')}>Already a member?</button>
          </div>
          <div className="categories">
            {INTERESTS.map((cat) => <div key={cat} className="cat-pill">{cat}</div>)}
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="orbital-panel main-panel">
            <div className="panel-header">
              <span className="dot dot-blue" />
              <span className="dot dot-gold" />
              <span className="dot dot-green" />
            </div>
            <div className="panel-body">
              <div className="mini-stat">
                <span className="mini-label">Current streak</span>
                <strong>12 days</strong>
              </div>
              <div className="mini-ring">
                <span>82%</span>
              </div>
              <div className="mini-steps">
                <span>Week 9 / 12</span>
                <span>AI plan updated</span>
              </div>
            </div>
          </div>

          <div className="orbital-panel side-panel top-panel">
            <span className="panel-tag">Personalized</span>
            <strong>Creative Path</strong>
          </div>

          <div className="orbital-panel side-panel bottom-panel">
            <span className="panel-tag">Weekly exam</span>
            <strong>+14 scored</strong>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-label">Why Personalized AI Learning Path?</div>
        <h2 className="section-title">Built different.<br />For real learners.</h2>
        <div className="features-grid">
          <div className="feature-card"><div className="feature-icon">🧠</div><h3>AI-Personalized Paths</h3><p>Our AI analyzes your skill level, free time, and learning style to generate a custom curriculum that evolves as you grow.</p></div>
          <div className="feature-card"><div className="feature-icon">📍</div><h3>Nearby Coach Centres</h3><p>Discover verified coaching centers and mentors near you. Filter by skill, rating, and availability.</p></div>
          <div className="feature-card"><div className="feature-icon">🌊</div><h3>Zero Pressure Pacing</h3><p>Paths auto-adjust based on your progress so you&apos;re always in your growth zone, never overwhelmed.</p></div>
          <div className="feature-card"><div className="feature-icon">📝</div><h3>Weekly Progress Exams</h3><p>Smart 15-question weekly assessments check what you&apos;ve absorbed and refine your path accordingly.</p></div>
        </div>
      </section>

      <div className="stats-section">
        <div><div className="stat-num">50K+</div><div className="stat-label">Active Learners</div></div>
        <div><div className="stat-num">200+</div><div className="stat-label">Skills Available</div></div>
        <div><div className="stat-num">1.2K</div><div className="stat-label">Verified Coaches</div></div>
        <div><div className="stat-num">94%</div><div className="stat-label">Goal Completion Rate</div></div>
      </div>
    </div>
  );
}
