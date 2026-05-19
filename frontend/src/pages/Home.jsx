import { useNavigate } from 'react-router-dom';
import { FileText, Brain, Shield, MapPin, ArrowRight, CheckCircle } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FileText size={24} />,
      color: '#6366f1',
      bg: 'rgba(99,102,241,0.12)',
      title: 'Easy Registration',
      desc: 'Submit complaints quickly with a clean, intuitive form. Track your complaint status in real-time.',
    },
    {
      icon: <Brain size={24} />,
      color: '#06b6d4',
      bg: 'rgba(6,182,212,0.12)',
      title: 'AI-Powered Analysis',
      desc: 'AI automatically detects complaint priority, recommends responsible departments, and generates responses.',
    },
    {
      icon: <Shield size={24} />,
      color: '#10b981',
      bg: 'rgba(16,185,129,0.12)',
      title: 'Secure & Authenticated',
      desc: 'JWT-based authentication with bcrypt password hashing keeps your data safe.',
    },
    {
      icon: <MapPin size={24} />,
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.12)',
      title: 'Location-Based Search',
      desc: 'Find complaints by location. Filter by category and status for easy management.',
    },
  ];

  const stats = [
    { label: 'Categories Supported', value: '7+' },
    { label: 'AI Features', value: '4' },
    { label: 'API Endpoints', value: '10+' },
    { label: 'Response Time', value: '<2s' },
  ];

  return (
    <div>
      {/* Hero */}
      <div className="hero">
        <div className="hero-badge">
          <Brain size={14} /> Powered by Artificial Intelligence
        </div>
        <h1>
          Smart <span>Complaint</span> Management<br />
          System
        </h1>
        <p>
          A MERN Stack application with AI capabilities to register, track, analyze, and resolve
          citizen complaints efficiently and transparently.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/submit')} id="hero-submit-btn">
            Submit a Complaint <ArrowRight size={18} />
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => navigate('/complaints')} id="hero-view-btn">
            View All Complaints
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="container">
        <div className="grid grid-4" style={{ marginBottom: 60 }}>
          {stats.map((s) => (
            <div key={s.label} className="card" style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#818cf8' }}>{s.value}</div>
              <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="features">
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Everything You Need</h2>
            <p style={{ color: '#94a3b8', marginTop: 8 }}>Built with modern MERN stack and AI integration</p>
          </div>
          <div className="grid grid-4">
            {features.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon" style={{ background: f.bg, color: f.color }}>
                  {f.icon}
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px', marginBottom: 40, background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.06))' }}>
          <CheckCircle size={40} style={{ color: '#6366f1', marginBottom: 16 }} />
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 10 }}>Ready to Get Started?</h2>
          <p style={{ color: '#94a3b8', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
            Register your complaint today and let AI handle the categorization and routing automatically.
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/submit')} id="cta-submit-btn">
            Submit Your Complaint <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
