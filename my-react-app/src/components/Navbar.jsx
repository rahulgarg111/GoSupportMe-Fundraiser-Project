import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { nameFromEmail } from '../utils/format';

const LINKS = [
  ['/dashboard', 'Explore'],
  ['/my-campaigns', 'My Campaigns'],
  ['/my-medals', 'My Medals'],
];

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!isAuthenticated) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const name = nameFromEmail(user?.email);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">♥</span>
          GoSupportMe
        </Link>

        <button className="menu-toggle" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu" aria-expanded={open}>☰</button>

        <nav className={`nav ${open ? 'open' : ''}`}>
          {LINKS.map(([to, label]) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setOpen(false)}>
              {label}
            </NavLink>
          ))}
          <Link to="/create-campaign" className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>＋ Start a fundraiser</Link>
          <div className="nav-user">
            <span className="avatar">{name.charAt(0)}</span>
            <span className="nav-user-name" title={user?.email}>{name}</span>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Log out</button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
