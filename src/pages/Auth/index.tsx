import { FC, FormEvent, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { useAppDispatch } from '../../store/store';
import { authActions } from '../../store/slices/auth';

const buildProfile = (userId: string, email: string, displayName: string) => ({
  id: userId,
  display_name: displayName,
  email,
  images: [] as any[],
  product: 'peytotoria',
  type: 'user',
  uri: `peytotoria:user:${userId}`,
  href: '',
  external_urls: { spotify: '' },
  followers: { href: null, total: 0 },
  country: 'US',
  explicit_content: { filter_enabled: false, filter_locked: false },
});

const AuthPage: FC = () => {
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const reset = (nextTab: 'login' | 'signup') => {
    setTab(nextTab);
    setError('');
    setInfo('');
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    const u = data.user!;
    const profile = buildProfile(
      u.id,
      u.email || email,
      u.user_metadata?.display_name || u.email?.split('@')[0] || 'Listener',
    );
    localStorage.setItem('peytotoria_user', JSON.stringify(profile));
    dispatch(authActions.setUser({ user: profile as any }));
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName || email.split('@')[0] } },
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    if (data.user && !data.session) {
      setInfo('Check your email to confirm your account, then log in.');
      setTab('login');
      return;
    }
    if (data.user && data.session) {
      const u = data.user;
      const profile = buildProfile(u.id, u.email || email, displayName || email.split('@')[0]);
      localStorage.setItem('peytotoria_user', JSON.stringify(profile));
      dispatch(authActions.setUser({ user: profile as any }));
    }
  };

  return (
    <div className='auth-page'>
      <div className='auth-card'>
        <div className='auth-logo'>
          <img src='/logo.png' alt='PeytOtoria' className='auth-logo-img' />
          <span className='auth-logo-text'>PeytOtoria</span>
        </div>

        <h1 className='auth-heading'>
          {tab === 'login' ? 'Log in to PeytOtoria' : 'Create your account'}
        </h1>

        <div className='auth-tabs'>
          <button className={tab === 'login' ? 'auth-tab active' : 'auth-tab'} onClick={() => reset('login')}>
            Log In
          </button>
          <button className={tab === 'signup' ? 'auth-tab active' : 'auth-tab'} onClick={() => reset('signup')}>
            Sign Up
          </button>
        </div>

        <form onSubmit={tab === 'login' ? handleLogin : handleSignup} className='auth-form'>
          {tab === 'signup' && (
            <div className='auth-field'>
              <label htmlFor='auth-name'>Display Name</label>
              <input
                id='auth-name'
                type='text'
                placeholder='Your name'
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                autoComplete='name'
              />
            </div>
          )}

          <div className='auth-field'>
            <label htmlFor='auth-email'>Email address</label>
            <input
              id='auth-email'
              type='email'
              placeholder='name@domain.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete='email'
            />
          </div>

          <div className='auth-field'>
            <label htmlFor='auth-password'>Password</label>
            <input
              id='auth-password'
              type='password'
              placeholder={tab === 'signup' ? 'Min. 6 characters' : '••••••••'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {error && <p className='auth-error'>{error}</p>}
          {info && <p className='auth-info'>{info}</p>}

          <button type='submit' className='auth-submit' disabled={loading}>
            {loading ? 'Please wait…' : tab === 'login' ? 'Log In' : 'Create Account'}
          </button>
        </form>

        {tab === 'login' ? (
          <p className='auth-switch'>
            {"Don't have an account? "}
            <button onClick={() => reset('signup')}>Sign up free</button>
          </p>
        ) : (
          <p className='auth-switch'>
            Already have an account?{' '}
            <button onClick={() => reset('login')}>Log in</button>
          </p>
        )}

        <div className='auth-powered'>
          <svg viewBox='0 0 24 24' fill='currentColor' width='14' height='14' aria-hidden='true'>
            <path d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z' />
          </svg>
          Powered by Apple Music catalog
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
