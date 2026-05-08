import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { useLoginMutation } from '@/hooks/auth/useLoginMutation';

export function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loginMutation = useLoginMutation();

  const oauthError =
    searchParams.get('error') === 'oauth_failed' ? 'Google login failed. Please try again.' : null;
  const error = oauthError ?? loginMutation.error?.message ?? null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    loginMutation.mutate({ email, password }, { onSuccess: () => navigate('/dashboard') });
  }

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', fontFamily: 'sans-serif' }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ display: 'block', width: '100%', marginTop: 4 }}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ display: 'block', width: '100%', marginTop: 4 }}
          />
        </label>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? 'Logging in…' : 'Login'}
        </button>
      </form>
      <hr style={{ margin: '24px 0' }} />
      <a
        href="/api/v1/auth/google"
        style={{
          display: 'block',
          textAlign: 'center',
          padding: '8px 16px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          textDecoration: 'none',
          color: '#333',
          fontFamily: 'sans-serif',
        }}
      >
        Login with Google
      </a>
      <p>
        Don&apos;t have an account? <Link to="/register">Register</Link>
      </p>
      <p>
        <Link to="/">← Back to home</Link>
      </p>
    </div>
  );
}
