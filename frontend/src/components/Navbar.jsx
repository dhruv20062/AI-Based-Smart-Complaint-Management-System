import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, FileText, List, Brain, LogOut, LogIn } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <ShieldCheck size={22} />
          SmartComplaint AI
        </NavLink>

        <div className="navbar-links">
          <NavLink to="/complaints" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <List size={15} style={{ display: 'inline', marginRight: 4 }} />
            Complaints
          </NavLink>

          <NavLink to="/submit" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <FileText size={15} style={{ display: 'inline', marginRight: 4 }} />
            Submit
          </NavLink>

          <NavLink to="/ai-analysis" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <Brain size={15} style={{ display: 'inline', marginRight: 4 }} />
            AI Analysis
          </NavLink>

          {user ? (
            <>
              {isAdmin && (
                <span className="nav-badge">Admin</span>
              )}
              <span className="nav-link text-muted" style={{ color: '#94a3b8', cursor: 'default' }}>
                {user.name}
              </span>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                <LogOut size={14} /> Logout
              </button>
            </>
          ) : (
            <NavLink to="/auth" className="btn btn-primary btn-sm">
              <LogIn size={14} /> Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
