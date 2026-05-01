import React, { useState } from 'react';
import './AdminLogin.css';

const ADMIN_EMAIL = 'admin@flatproduction.rw';
const ADMIN_PASSWORD = 'admin123';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    const safeEmail = email.trim().toLowerCase();

    if (safeEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem('flat_admin_auth', '1');
      sessionStorage.setItem('flat_admin_email', safeEmail);
      window.location.pathname = '/admin';
      return;
    }

    setError('Invalid email or password');
  };

  return (
    <div className="admin-login-shell">
      <div className="admin-login-glow" aria-hidden="true"></div>
      <main className="admin-login-card" role="main">
        <p className="admin-login-kicker">Flat Productions</p>
        <h1>Admin Access</h1>
        <p className="admin-login-subtitle">Sign in to manage homepage content, services, portfolio, gallery, and clients.</p>

        <form onSubmit={submit} className="admin-login-form">
          <label>
            <span>Email</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              autoComplete="email"
              placeholder="admin@flatproduction.rw"
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              autoComplete="current-password"
              placeholder="Enter password"
              required
            />
          </label>

          {error ? <div className="admin-login-error">{error}</div> : null}

          <button type="submit" className="admin-login-submit">
            Log in
          </button>
        </form>
      </main>
    </div>
  );
};

export default Login;
