import { useState, useEffect } from 'react';
import { getAllComplaints, analyzeComplaint } from '../services/api';
import { PriorityBadge, StatusBadge } from '../components/Badges';
import toast from 'react-hot-toast';
import { Brain, Zap, AlertTriangle, BarChart2, MapPin, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AIAnalysis() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzingId, setAnalyzingId] = useState(null);
  const navigate = useNavigate();

  const fetchAll = async () => {
    setLoading(true);
    try {
      const { data } = await getAllComplaints({ limit: 50 });
      setComplaints(data.data);
    } catch {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleAnalyze = async (id) => {
    setAnalyzingId(id);
    try {
      await analyzeComplaint(id);
      toast.success('AI analysis complete!');
      fetchAll();
    } catch {
      toast.error('Analysis failed');
    } finally {
      setAnalyzingId(null);
    }
  };

  const analyzed = complaints.filter((c) => c.aiPriority);
  const unanalyzed = complaints.filter((c) => !c.aiPriority);

  const priorityCounts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  analyzed.forEach((c) => { if (priorityCounts[c.aiPriority] !== undefined) priorityCounts[c.aiPriority]++; });

  const statCards = [
    { label: 'Total Analyzed', value: analyzed.length, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
    { label: 'Critical Priority', value: priorityCounts.Critical, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
    { label: 'High Priority', value: priorityCounts.High, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Pending Analysis', value: unanalyzed.length, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
  ];

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <div style={{ background: 'rgba(99,102,241,0.1)', padding: 14, borderRadius: 16 }}>
              <Brain size={28} style={{ color: '#818cf8' }} />
            </div>
          </div>
          <h1>AI Analysis Dashboard</h1>
          <p>Complaint priority detection, department recommendation & auto-response generation</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-4" style={{ marginBottom: 36 }}>
          {statCards.map((s) => (
            <div key={s.label} className="stat-card">
              <div className="stat-icon" style={{ background: s.bg, color: s.color }}>
                <BarChart2 size={22} />
              </div>
              <div className="stat-info">
                <h3 style={{ color: s.color }}>{s.value}</h3>
                <p>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Unanalyzed Section */}
        {unanalyzed.length > 0 && (
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={18} style={{ color: '#f59e0b' }} /> Awaiting AI Analysis ({unanalyzed.length})
            </h2>
            <div className="grid grid-3">
              {unanalyzed.map((c) => (
                <div key={c._id} className="complaint-card">
                  <div className="complaint-header">
                    <div>
                      <div className="complaint-title">{c.title}</div>
                      <div className="complaint-meta">
                        <span><MapPin size={12} /> {c.location}</span>
                        <span><Tag size={12} /> {c.category}</span>
                      </div>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="complaint-desc">{c.description.slice(0, 100)}...</p>
                  <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
                    <button
                      className="btn btn-sm"
                      style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)' }}
                      onClick={() => handleAnalyze(c._id)}
                      disabled={analyzingId === c._id}
                      id={`analyze-btn-${c._id}`}
                    >
                      {analyzingId === c._id ? <span className="spinner" /> : <Brain size={13} />}
                      Run AI Analysis
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/complaints/${c._id}`)}>
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analyzed Section */}
        {analyzed.length > 0 && (
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap size={18} style={{ color: '#10b981' }} /> AI Analyzed Complaints ({analyzed.length})
            </h2>
            <div className="grid grid-3">
              {analyzed.map((c) => (
                <div key={c._id} className="complaint-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/complaints/${c._id}`)}>
                  <div className="complaint-header">
                    <div>
                      <div className="complaint-title">{c.title}</div>
                      <div className="complaint-meta">
                        <span><MapPin size={12} /> {c.location}</span>
                        <span><Tag size={12} /> {c.category}</span>
                      </div>
                    </div>
                    <PriorityBadge priority={c.aiPriority} />
                  </div>
                  <div className="ai-result">
                    <h4><Brain size={13} /> AI Results</h4>
                    <div className="ai-item">
                      <span className="ai-label">Department:</span>
                      <span className="ai-value">{c.aiDepartment}</span>
                    </div>
                    {c.aiSummary && (
                      <div className="ai-item">
                        <span className="ai-label">Summary:</span>
                        <span className="ai-value">{c.aiSummary.slice(0, 90)}...</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <span className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
          </div>
        )}

        {!loading && complaints.length === 0 && (
          <div className="empty-state">
            <Brain size={60} />
            <h3>No complaints to analyze</h3>
            <p>Submit some complaints first, then run AI analysis.</p>
          </div>
        )}
      </div>
    </div>
  );
}
