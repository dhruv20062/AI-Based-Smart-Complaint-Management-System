import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { ShieldCheck, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';

export default function Auth() {
  const [tab, setTab] = useState('login');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginUser(loginForm);
      login(data.data);
      toast.success('Login successful!');
      navigate('/complaints');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await registerUser(registerForm);
      login(data.data);
      toast.success('Account created successfully!');
      navigate('/complaints');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', background: 'rgba(99,102,241,0.1)', padding: 16, borderRadius: 20, marginBottom: 14 }}>
            <ShieldCheck size={32} style={{ color: '#818cf8' }} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>SmartComplaint AI</h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: 4 }}>Secure Authentication Portal</p>
        </div>

        <div className="card">
          <div className="auth-tabs">
            <button
              className={`auth-tab${tab === 'login' ? ' active' : ''}`}
              onClick={() => setTab('login')} id="login-tab"
            >
              <LogIn size={14} style={{ display: 'inline', marginRight: 6 }} /> Login
            </button>
            <button
              className={`auth-tab${tab === 'register' ? ' active' : ''}`}
              onClick={() => setTab('register')} id="register-tab"
            >
              <UserPlus size={14} style={{ display: 'inline', marginRight: 6 }} /> Register
            </button>
          </div>

          {tab === 'login' ? (
            <form onSubmit={handleLogin} id="login-form">
              <div className="form-group">
                <label className="form-label" htmlFor="login-email">Email Address</label>
                <input
                  id="login-email" type="email" className="form-control"
                  placeholder="your@email.com" required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="login-password">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="login-password" type={showPass ? 'text' : 'password'}
                    className="form-control" placeholder="••••••••" required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    style={{ paddingRight: 44 }}
                  />
                  <button
                    type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b' }}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-full btn-lg" id="login-btn" disabled={loading}>
                {loading ? <><span className="spinner" /> Logging in...</> : <><LogIn size={16} /> Login</>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} id="register-form">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-name">Full Name</label>
                <input
                  id="reg-name" type="text" className="form-control"
                  placeholder="Your Name" required
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-email">Email Address</label>
                <input
                  id="reg-email" type="email" className="form-control"
                  placeholder="your@email.com" required
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-password">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="reg-password" type={showPass ? 'text' : 'password'}
                    className="form-control" placeholder="Min 6 characters" required minLength={6}
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    style={{ paddingRight: 44 }}
                  />
                  <button
                    type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b' }}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-full btn-lg" id="register-btn" disabled={loading}>
                {loading ? <><span className="spinner" /> Creating account...</> : <><UserPlus size={16} /> Create Account</>}
              </button>
            </form>
          )}
        </div>

        <p className="text-muted text-center" style={{ marginTop: 16 }}>
          {tab === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => setTab(tab === 'login' ? 'register' : 'login')}
            style={{ background: 'none', border: 'none', color: '#818cf8', fontWeight: 600, cursor: 'pointer' }}
          >
            {tab === 'login' ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}
