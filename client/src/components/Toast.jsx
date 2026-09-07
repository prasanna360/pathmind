import { useAuth } from '../context/AuthContext.jsx';

export default function Toast() {
  const { toast } = useAuth();
  return (
    <div className={`toast${toast ? ' show' : ''}`}>
      <span>{toast || 'Done!'}</span>
    </div>
  );
}
