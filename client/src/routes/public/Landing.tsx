import { Link } from 'react-router-dom';

import { StarterLogo } from '@/components/StarterLogo';
import { useAuth } from '@/context/useAuth.ts';

export function Landing() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <main className="page reveal">
      <section className="panel">
        <div className="panel__content">
          <div>
            <StarterLogo size="lg" />
          </div>
          <div className="eyebrow">Production-ready starter</div>
          <h1 className="headline">Ship features, not setup work.</h1>
          <p className="subhead">
            Opinionated fullstack TypeScript foundation with auth, API patterns, and clean module
            boundaries already in place.
          </p>

          {isAuthenticated ? (
            <div className="button-row">
              <Link to="/dashboard">
                <button type="button" className="btn btn--primary">
                  Open Dashboard
                </button>
              </Link>
              <button type="button" className="btn btn--ghost" onClick={logout}>
                Sign Out
              </button>
            </div>
          ) : (
            <div className="button-row">
              <Link to="/login">
                <button type="button" className="btn btn--primary">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button type="button" className="btn">
                  Create Account
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
