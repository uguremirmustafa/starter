import type { FormEvent } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AppLogo } from '@/components/AppLogo';
import { useRegisterMutation } from '@/hooks/auth/useRegisterMutation';

export function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const registerMutation = useRegisterMutation();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    registerMutation.mutate({ name, email, password }, { onSuccess: () => navigate('/dashboard') });
  }

  return (
    <main className="page reveal">
      <section className="panel panel--narrow">
        <div className="panel__content">
          <AppLogo size="md" />
          <h1 className="headline">Create Your Account</h1>
          <p className="subhead">Set up your workspace in less than a minute.</p>

          <form onSubmit={handleSubmit} className="form">
            <label className="field">
              Name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input"
                placeholder="Jane Doe"
              />
            </label>
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
                placeholder="Choose a strong password"
              />
            </label>
            {registerMutation.error && <p className="error">{registerMutation.error.message}</p>}
            <button
              type="submit"
              className="btn btn--primary"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? 'Registering...' : 'Register'}
            </button>
          </form>

          <div className="meta-row">
            <span className="muted">Already have an account?</span>
            <Link to="/login" className="link-btn">
              Login
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
