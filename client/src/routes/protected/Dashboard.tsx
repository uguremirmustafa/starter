import { Link } from 'react-router-dom';

import { StarterLogo } from '@/components/StarterLogo';
import { useAuth } from '@/context/useAuth.ts';
import { useCurrentUser } from '@/hooks/auth/useCurrentUser';

export function Dashboard() {
  const { logout } = useAuth();
  const { data: user } = useCurrentUser();

  return (
    <main className="page reveal">
      <section className="panel">
        <div className="panel__content">
          <StarterLogo size="md" />
          <h1 className="headline">Dashboard</h1>
          <p className="subhead">
            Welcome back. Your account session is active.
          </p>

          {user ? (
            <div className="profile">
              <div className="profile__item">
                <span className="muted">Email</span>
                <span>{user.email}</span>
              </div>
              <div className="profile__item">
                <span className="muted">Role</span>
                <span>{user.role}</span>
              </div>
            </div>
          ) : null}

          <div className="button-row">
            <Link to="/">
              <button type="button" className="btn">
                Home
              </button>
            </Link>
            <button type="button" className="btn btn--ghost" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
