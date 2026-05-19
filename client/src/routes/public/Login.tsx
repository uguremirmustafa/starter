import type { FormEvent } from 'react';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { AppLogo } from '@/components/AppLogo';
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
    <main className="page reveal">
      <section className="panel panel--narrow">
        <div className="panel__content">
          <AppLogo size="md" />
          <h1 className="headline">Welcome Back</h1>
          <p className="subhead">Continue to your workspace and API dashboard.</p>

          <form onSubmit={handleSubmit} className="form">
            <label className="field">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input"
                placeholder="you@company.com"
              />
            </label>
            <label className="field">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input"
                placeholder="Enter your password"
              />
            </label>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn btn--primary" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <hr className="divider" />
          <a href="/api/v1/auth/google" className="btn btn--ghost">
            Continue with Google
          </a>
          <div className="meta-row">
            <span className="muted">Need an account?</span>
            <Link to="/register" className="link-btn">
              Register
            </Link>
          </div>
          <div className="meta-row">
            <Link to="/" className="link-btn">
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
