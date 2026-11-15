import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { CODING_TRACKS, getInterestLabel, instrumentNames, normalizeInterest } from '../data/constants.js';

export default function Nav({ onOpenAuth, theme, onToggleTheme }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const interests = (user?.interests || []).map(normalizeInterest);
  const codingTracks = user?.codingTracks?.length
    ? user.codingTracks
    : user?.codingTrack
      ? [user.codingTrack]
      : [];

  const goHome = () => {
    if (user) navigate('/dashboard');
    else navigate('/');
  };

  return (
    <nav>
      <div className="logo" onClick={goHome} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && goHome()}>
        Personalized AI Learning Path
      </div>
      <div className="nav-actions">
        <button
          type="button"
          className="btn btn-outline theme-toggle"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          aria-pressed={theme === 'dark'}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          {theme === 'light' ? '☾' : '☀'}
        </button>
        {user ? (
          <div className="nav-user" style={{ display: 'flex' }}>
            <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
            <div className="profile-menu">
              <button
                type="button"
                className="profile-trigger"
                aria-expanded={profileOpen}
                aria-controls="profile-details"
                onClick={() => setProfileOpen((open) => !open)}
              >
                {user.name.split(' ')[0]}
              </button>
              {profileOpen && (
                <section className="profile-popover" id="profile-details" aria-label="Profile details">
                  <h2>Profile details</h2>
                  <dl className="profile-details-list">
                    <div><dt>Full name</dt><dd>{user.name || 'Not provided'}</dd></div>
                    <div><dt>Email address</dt><dd>{user.email || 'Not provided'}</dd></div>
                    <div><dt>Age</dt><dd>{user.age ? `${user.age} years` : 'Not provided'}</dd></div>
                    <div><dt>Interests</dt><dd>{interests.map(getInterestLabel).join(', ') || 'Not provided'}</dd></div>
                    {interests.includes('🎸 Music') && (
                      <div><dt>Instrument</dt><dd>{instrumentNames[user.instrument] || user.instrument || 'Not selected'}</dd></div>
                    )}
                    {interests.includes('💻 Coding') && (
                      <div><dt>Coding languages</dt><dd>{codingTracks.map((track) => CODING_TRACKS.find((option) => option.value === track)?.label || track).join(', ') || 'Not selected'}</dd></div>
                    )}
                    <div><dt>Daily learning time</dt><dd>{user.freeTime || 60} minutes</dd></div>
                    <div><dt>Skill level</dt><dd>{user.skillLevel || 'Beginner'}</dd></div>
                    <div><dt>Learning goal</dt><dd>{user.goal || 'Not provided'}</dd></div>
                  </dl>
                </section>
              )}
            </div>
            <button type="button" className="btn btn-ghost" onClick={() => { logout(); navigate('/'); }}>
              Logout
            </button>
          </div>
        ) : (
          <>
            <button type="button" className="btn btn-outline" onClick={() => onOpenAuth('login')}>Log in</button>
            <button type="button" className="btn btn-primary" onClick={() => onOpenAuth('signup')}>Get Started →</button>
          </>
        )}
      </div>
    </nav>
  );
}
