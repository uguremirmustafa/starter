import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div style={{ maxWidth: 600, margin: '80px auto', fontFamily: 'sans-serif' }}>
      <h1>Dashboard</h1>
      <p>Welcome back{user?.name ? `, ${user.name}` : ''}!</p>
      {user && (
        <ul style={{ lineHeight: 1.8 }}>
          <li><strong>Email:</strong> {user.email}</li>
          <li><strong>Role:</strong> {user.role}</li>
        </ul>
      )}
      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <Link to="/">
          <button>Home</button>
        </Link>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  )
}
