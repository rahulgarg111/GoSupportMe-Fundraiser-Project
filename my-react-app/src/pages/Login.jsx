import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FRIENDLY_ERRORS = {
  'auth/invalid-credential': 'Wrong email or password.',
  'auth/invalid-login-credentials': 'Wrong email or password.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Wrong email or password.',
  'auth/email-already-in-use': 'An account with this email already exists. Try signing in.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/too-many-requests': 'Too many attempts. Please wait a minute and try again.',
  'auth/network-request-failed': "Couldn't reach the server. Check your connection.",
};

const POINTS = [
  ['🚀', 'Launch in minutes', 'A guided 4-step flow with a live preview of your fundraiser.'],
  ['🎯', 'Milestones that motivate', 'Show supporters what each stage of funding unlocks.'],
  ['🏅', 'Recognise top donors', 'Your biggest supporters earn medals on their profile.'],
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  if (isAuthenticated) return <Navigate to={from} replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    try {
      if (isSignup) await signup(email, password);
      else await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(FRIENDLY_ERRORS[err.code] || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-hero">
        <div className="brand brand-light"><span className="brand-mark">♥</span>GoSupportMe</div>
        <div>
          <h1>Raise money for what matters to you.</h1>
          <p>Start a fundraiser, share your story and watch support grow in real time.</p>
        </div>
        <ul className="auth-points">
          {POINTS.map(([icon, title, text]) => (
            <li key={title}><span className="auth-point-icon">{icon}</span><div><strong>{title}</strong><p>{text}</p></div></li>
          ))}
        </ul>
      </section>

      <section className="auth-panel">
        <form className="auth-card" onSubmit={handleSubmit}>
          <h2>{isSignup ? 'Create your account' : 'Welcome back'}</h2>
          <p className="muted">{isSignup ? 'Start your first fundraiser today.' : 'Sign in to support or manage fundraisers.'}</p>

          <div className="segmented">
            <button type="button" className={!isSignup ? 'active' : ''} onClick={() => { setIsSignup(false); setError(''); }}>Sign in</button>
            <button type="button" className={isSignup ? 'active' : ''} onClick={() => { setIsSignup(true); setError(''); }}>Sign up</button>
          </div>

          {error && <div className="alert">{error}</div>}

          <label className="field">
            <span>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
          </label>
          <label className="field">
            <span>Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={isSignup ? 'At least 6 characters' : 'Your password'} autoComplete={isSignup ? 'new-password' : 'current-password'} />
          </label>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Please wait…' : isSignup ? 'Create account' : 'Sign in'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default Login;
