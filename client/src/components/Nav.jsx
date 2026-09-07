import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Nav({ onOpenAuth }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const goHome = () => {
    if (user) navigate('/dashboard');
    else navigate('/');
  };

  return (
    <nav>
      <div className="logo" onClick={goHome} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && goHome()}>
        Personalized AI Learning Path ✦
      </div>
      <div className="nav-actions">
        {user ? (
          <div className="nav-user" style={{ display: 'flex' }}>
            <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
            <span>{user.name.split(' ')[0]}</span>
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
