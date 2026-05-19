import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getComplaintById, analyzeComplaint } from '../services/api';
import { StatusBadge, PriorityBadge } from '../components/Badges';
import toast from 'react-hot-toast';
import {
  MapPin, Tag, Calendar, User, Mail, Brain, ArrowLeft, Edit, MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const { data } = await getComplaintById(id);
        setComplaint(data.data);
      } catch {
        toast.error('Complaint not found');
        navigate('/complaints');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id, navigate]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      await analyzeComplaint(id);
      const { data } = await getComplaintById(id);
      setComplaint(data.data);
      toast.success('AI analysis complete!');
    } catch {
      toast.error('AI analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
    </div>
  );

  if (!complaint) return null;

  const formatDate = (d) => new Date(d).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 760 }}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/complaints')} style={{ marginBottom: 24 }} id="back-btn">
          <ArrowLeft size={15} /> Back to List
        </button>

        <div className="card" style={{ marginBottom: 20 }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 10 }}>{complaint.title}</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <StatusBadge status={complaint.status} />
                {complaint.aiPriority && <PriorityBadge priority={complaint.aiPriority} />}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button
                className="btn btn-sm"
                style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)' }}
                onClick={handleAnalyze} disabled={analyzing} id="analyze-btn"
              >
                {analyzing ? <span className="spinner" /> : <Brain size={14} />}
                AI Analyze
              </button>
              {isAdmin && (
                <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/update/${complaint._id}`)} id="edit-btn">
                  <Edit size={14} /> Update Status
                </button>
              )}
            </div>
          </div>

          <hr className="divider" />

          {/* Meta Info */}
          <div className="grid grid-2" style={{ gap: 14, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: '0.88rem' }}>
              <User size={15} style={{ color: '#6366f1' }} />
              <span><strong style={{ color: '#f1f5f9' }}>Name:</strong> {complaint.name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: '0.88rem' }}>
              <Mail size={15} style={{ color: '#6366f1' }} />
              <span><strong style={{ color: '#f1f5f9' }}>Email:</strong> {complaint.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: '0.88rem' }}>
              <Tag size={15} style={{ color: '#06b6d4' }} />
              <span><strong style={{ color: '#f1f5f9' }}>Category:</strong> {complaint.category}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: '0.88rem' }}>
              <MapPin size={15} style={{ color: '#06b6d4' }} />
              <span><strong style={{ color: '#f1f5f9' }}>Location:</strong> {complaint.location}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: '0.88rem' }}>
              <Calendar size={15} style={{ color: '#10b981' }} />
              <span><strong style={{ color: '#f1f5f9' }}>Submitted:</strong> {formatDate(complaint.createdAt)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: '0.88rem' }}>
              <Calendar size={15} style={{ color: '#10b981' }} />
              <span><strong style={{ color: '#f1f5f9' }}>Updated:</strong> {formatDate(complaint.updatedAt)}</span>
            </div>
          </div>

          {/* Description */}
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 18, marginBottom: 20 }}>
            <h4 style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <MessageSquare size={14} /> Description
            </h4>
            <p style={{ color: '#e2e8f0', lineHeight: 1.7, fontSize: '0.92rem' }}>{complaint.description}</p>
          </div>

          {/* AI Analysis Result */}
          {complaint.aiPriority && (
            <div className="ai-result">
              <h4><Brain size={14} /> AI Analysis Results</h4>
              <div className="ai-item">
                <span className="ai-label">Priority:</span>
                <PriorityBadge priority={complaint.aiPriority} />
              </div>
              <div className="ai-item">
                <span className="ai-label">Department:</span>
                <span className="ai-value">{complaint.aiDepartment}</span>
              </div>
              {complaint.aiSummary && (
                <div className="ai-item">
                  <span className="ai-label">Summary:</span>
                  <span className="ai-value">{complaint.aiSummary}</span>
                </div>
              )}
              {complaint.aiResponse && (
                <div style={{ marginTop: 12 }}>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: 6 }}>Auto-Generated Response:</p>
                  <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: 14, fontSize: '0.84rem', color: '#94a3b8', whiteSpace: 'pre-line', lineHeight: 1.7 }}>
                    {complaint.aiResponse}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
