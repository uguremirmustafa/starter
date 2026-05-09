import { Link } from 'react-router-dom';

import { useAuth } from '@/context/useAuth.ts';

export function Landing() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div
      style={{
        maxWidth: 600,
        margin: '80px auto',
        textAlign: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <h1>Welcome to the Starter App</h1>
      <p>A fullstack TypeScript starter with Express API and React frontend.</p>
      {isAuthenticated ? (
        <div
          style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            marginTop: 24,
          }}
        >
          <Link to="/dashboard">
            <button type="button">Go to Dashboard</button>
          </Link>
          <button type="button" onClick={logout}>
            Logout
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            marginTop: 24,
          }}
        >
          <Link to="/login">
            <button type="button">Login</button>
          </Link>
          <Link to="/register">
            <button type="button">Register</button>
          </Link>
        </div>
      )}
    </div>
  );
}
