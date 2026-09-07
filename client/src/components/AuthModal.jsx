import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { CODING_TRACKS, INTERESTS, INSTRUMENTS } from '../data/constants.js';

export default function AuthModal({ tab: initialTab, onClose }) {
  const { login, signup, showToast } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState(initialTab || 'login');
  const [error, setError] = useState('');
  const [alreadyReg, setAlreadyReg] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState([]);

  const [form, setForm] = useState({
    name: '',
    email: '',
    age: '',
    password: '',
    loginEmail: '',
    loginPassword: '',
    freeTime: '60',
    goal: '',
    skillLevel: 'Beginner',
    instrument: '🎸',
    codingTrack: 'Web Development',
    codingTracks: ['Web Development'],
  });

  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const toggleInterest = (val) => {
    setSelectedInterests((prev) => {
      if (prev.includes(val)) return prev.filter((x) => x !== val);
      if (prev.length >= 3) {
        showToast('⚠️ You can select up to 3 interests only.');
        return prev;
      }
      return [...prev, val];
    });
  };

  const toggleCodingTrack = (value) => {
    setForm((current) => {
      const tracks = current.codingTracks.includes(value)
        ? current.codingTracks.filter((track) => track !== value)
        : [...current.codingTracks, value];
      return { ...current, codingTracks: tracks, codingTrack: tracks[0] || value };
    });
  };

  const handleLogin = async () => {
    setError('');
    try {
      await login(form.loginEmail.trim(), form.loginPassword);
      onClose();
      navigate('/dashboard');
      showToast('✅ Welcome back!');
    } catch (err) {
      setError(err.message);
    }
  };

  const signupStep1 = () => {
    setError('');
    const { name, email, age, password } = form;
    if (!name.trim()) return setError('Please enter your name.');
    if (!email.includes('@')) return setError('Please enter a valid email address.');
    const ageNum = parseInt(age, 10);
    if (!ageNum || ageNum < 18 || ageNum > 35) return setError('Age must be between 18 and 35.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    setStep(2);
  };

  const handleSignup = async () => {
    setError('');
    if (selectedInterests.length === 0) return setError('Please select at least one interest.');
    try {
      await signup({
        name: form.name.trim(),
        email: form.email.trim(),
        age: parseInt(form.age, 10),
        password: form.password,
        interests: selectedInterests,
        codingTracks: form.codingTracks,
        freeTime: parseInt(form.freeTime, 10),
        instrument: selectedInterests.includes('🎸 Music') ? form.instrument : null,
        codingTrack: selectedInterests.includes('💻 Coding') ? form.codingTrack : null,
      });
      onClose();
      navigate('/dashboard');
      showToast('🚀 Account created! Welcome aboard.');
    } catch (err) {
      if (err.code === 'already_registered') setAlreadyReg(true);
      else setError(err.message);
    }
  };

  return (
    <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button type="button" className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-logo">Personalized AI Learning Path ✦</div>
        <h2 className="modal-title">{tab === 'login' ? 'Welcome back' : 'Join Personalized AI Learning Path'}</h2>
        <p className="modal-sub">{tab === 'login' ? 'Sign in to continue your journey' : 'Free account · Takes 60 seconds'}</p>

        <div className="tab-row">
          <button type="button" className={`tab-btn${tab === 'login' ? ' active' : ''}`} onClick={() => { setTab('login'); setError(''); setAlreadyReg(false); }}>Log In</button>
          <button type="button" className={`tab-btn${tab === 'signup' ? ' active' : ''}`} onClick={() => { setTab('signup'); setError(''); setAlreadyReg(false); setStep(1); }}>Sign Up</button>
        </div>

        {error && <div className="auth-error show">{error}</div>}
        {tab === 'login' && (
          <div>
            <div className="form-group"><label>Email Address</label><input type="email" value={form.loginEmail} onChange={(e) => setField('loginEmail', e.target.value)} placeholder="you@example.com" /></div>
            <div className="form-group"><label>Password</label><input type="password" value={form.loginPassword} onChange={(e) => setField('loginPassword', e.target.value)} placeholder="••••••••" /></div>
            <button type="button" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '.85rem', borderRadius: '14px', marginTop: '.5rem' }} onClick={handleLogin}>
              Log In to Personalized AI Learning Path →
            </button>
          </div>
        )}

        {tab === 'signup' && alreadyReg && (
          <div className="already-reg-wall">
            <div className="big-icon">🎓</div>
            <h3>You&apos;re Already Registered!</h3>
            <p>An account with this email already exists. Please log in to access your dashboard.</p>
            <button type="button" className="btn btn-primary" style={{ width: '100%' }} onClick={() => { setAlreadyReg(false); setTab('login'); }}>Go to Login →</button>
          </div>
        )}

        {tab === 'signup' && !alreadyReg && step === 1 && (
          <div>
            <div className="step-dots"><div className="step-dot active" /><div className="step-dot" /></div>
            <div className="form-group"><label>Full Name</label><input type="text" value={form.name} onChange={(e) => setField('name', e.target.value)} placeholder="Your full name" /></div>
            <div className="form-group"><label>Email Address</label><input type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} placeholder="you@example.com" /></div>
            <div className="form-group"><label>Age (18–35 only)</label><input type="number" value={form.age} onChange={(e) => setField('age', e.target.value)} placeholder="e.g. 24" min="18" max="35" /></div>
            <div className="form-group"><label>Password</label><input type="password" value={form.password} onChange={(e) => setField('password', e.target.value)} placeholder="Min 6 characters" /></div>
            <button type="button" className="btn btn-primary" style={{ width: '100%' }} onClick={signupStep1}>Continue →</button>
          </div>
        )}

        {tab === 'signup' && !alreadyReg && step === 2 && (
          <div>
            <div className="step-dots"><div className="step-dot" /><div className="step-dot active" /></div>
            <div className="form-group">
              <label>What do you want to learn? (pick at least 1)</label>
              <div className="interest-grid">
                {INTERESTS.map((item) => (
                  <div key={item} className={`interest-chip${selectedInterests.includes(item) ? ' selected' : ''}`} onClick={() => toggleInterest(item)} role="button" tabIndex={0}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            {selectedInterests.includes('🎸 Music') && (
              <div className="form-group">
                <label>Which instrument?</label>
                <select value={form.instrument} onChange={(e) => setField('instrument', e.target.value)}>
                  {INSTRUMENTS.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
                </select>
              </div>
            )}
            {selectedInterests.includes('💻 Coding') && (
              <div className="form-group">
                <label>Which coding languages? (pick all that apply)</label>
                <div className="track-grid">
                  {CODING_TRACKS.map((track) => <button type="button" key={track.value} className={`track-option${form.codingTracks.includes(track.value) ? ' selected' : ''}`} onClick={() => toggleCodingTrack(track.value)}>{form.codingTracks.includes(track.value) ? '✓ ' : ''}{track.label}</button>)}
                </div>
              </div>
            )}
            <div className="form-group">
              <label>Daily free time</label>
              <select value={form.freeTime} onChange={(e) => setField('freeTime', e.target.value)}>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2+ hours</option>
              </select>
            </div>
            <div className="form-group">
              <label>What would you like to achieve?</label>
              <input type="text" value={form.goal} onChange={(e) => setField('goal', e.target.value)} placeholder="e.g. Build my first website" maxLength={120} />
            </div>
            <div className="form-group">
              <label>Current skill level</label>
              <select value={form.skillLevel} onChange={(e) => setField('skillLevel', e.target.value)}>
                <option value="Beginner">Beginner</option>
                <option value="Some experience">Some experience</option>
                <option value="Intermediate">Intermediate</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '.75rem' }}>
              <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setStep(1)}>← Back</button>
              <button type="button" className="btn btn-primary" style={{ flex: 2 }} onClick={handleSignup}>Create Account 🚀</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
