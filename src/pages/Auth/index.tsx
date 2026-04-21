import { FC, FormEvent, useState } from 'react';
import { useAppDispatch } from '../../store/store';
import { authActions } from '../../store/slices/auth';
import type { User } from '../../interfaces/user';

// ─── Local storage helpers ────────────────────────────────────────────────────

interface StoredAccount {
  email: string;
  password: string;
  user: User;
}

const getAccounts = (): StoredAccount[] => {
  try {
    return JSON.parse(localStorage.getItem('peytotoria_accounts') || '[]');
  } catch {
    return [];
  }
};

const saveAccount = (account: StoredAccount) => {
  const accounts = getAccounts();
  accounts.push(account);
  localStorage.setItem('peytotoria_accounts', JSON.stringify(accounts));
};

const saveCurrentUser = (user: User) => {
  localStorage.setItem('peytotoria_user', JSON.stringify(user));
};

// ─── Component ────────────────────────────────────────────────────────────────

const AuthPage: FC = () => {
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    const accounts = getAccounts();
    const match = accounts.find(
      (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );
    if (!match) {
      setError('Invalid email or password.');
      return;
    }
    saveCurrentUser(match.user);
    dispatch(authActions.setUser({ user: match.user }));
  };

  const handleSignup = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password || !displayName) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    const accounts = getAccounts();
    if (accounts.find((a) => a.email.toLowerCase() === email.toLowerCase())) {
      setError('An account with this email already exists.');
      return;
    }
    const user: User = {
      id: `local_${Date.now()}`,
      display_name: displayName,
      email,
      images: [],
      product: 'premium',
      country: 'US',
    };
    saveAccount({ email, password, user });
    saveCurrentUser(user);
    dispatch(authActions.setUser({ user }));
  };

  return (
    <div className='auth-page'>
      <div className='auth-card'>
        {/* Logo */}
        <div className='auth-logo'>
          <svg viewBox='0 0 24 24' fill='currentColor' width='40' height='40'>
            <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z' />
          </svg>
          <span className='auth-logo-text'>PeytOtoria</span>
        </div>

        <h1 className='auth-heading'>
          {tab === 'login' ? 'Log in to PeytOtoria' : 'Create your account'}
        </h1>

        {/* Tabs */}
        <div className='auth-tabs'>
          <button
            className={tab === 'login' ? 'auth-tab active' : 'auth-tab'}
            onClick={() => {
              setTab('login');
              setError('');
            }}
          >
            Log In
          </button>
          <button
            className={tab === 'signup' ? 'auth-tab active' : 'auth-tab'}
            onClick={() => {
              setTab('signup');
              setError('');
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={tab === 'login' ? handleLogin : handleSignup} className='auth-form'>
          {tab === 'signup' && (
            <div className='auth-field'>
              <label htmlFor='displayName'>Display Name</label>
              <input
                id='displayName'
                type='text'
                placeholder='Your name'
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                autoComplete='name'
              />
            </div>
          )}

          <div className='auth-field'>
            <label htmlFor='email'>Email address</label>
            <input
              id='email'
              type='email'
              placeholder='name@domain.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete='email'
            />
          </div>

          <div className='auth-field'>
            <label htmlFor='password'>Password</label>
            <input
              id='password'
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {error && <p className='auth-error'>{error}</p>}

          <button type='submit' className='auth-submit'>
            {tab === 'login' ? 'Log In' : 'Create Account'}
          </button>
        </form>

        {tab === 'login' && (
          <p className='auth-switch'>
            {"Don't have an account? "}
            <button onClick={() => { setTab('signup'); setError(''); }}>Sign up here</button>
          </p>
        )}
        {tab === 'signup' && (
          <p className='auth-switch'>
            Already have an account?{' '}
            <button onClick={() => { setTab('login'); setError(''); }}>Log in here</button>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
