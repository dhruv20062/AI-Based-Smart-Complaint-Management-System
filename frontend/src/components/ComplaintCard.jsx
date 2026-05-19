import { useNavigate } from 'react-router-dom';
import { StatusBadge, PriorityBadge } from './Badges';
import { MapPin, Tag, Calendar, User, Brain, Trash2, Edit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { deleteComplaint } from '../services/api';
import toast from 'react-hot-toast';

export default function ComplaintCard({ complaint, onRefresh, onAnalyze }) {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm('Delete this complaint?')) return;
    try {
      await deleteComplaint(complaint._id);
      toast.success('Complaint removed');
      onRefresh?.();
    } catch {
      toast.error('Failed to delete. Admin login required.');
    }
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const d = Math.floor(diff / 86400000);
    if (d > 0) return `${d}d ago`;
    const h = Math.floor(diff / 3600000);
    if (h > 0) return `${h}h ago`;
    return 'Just now';
  };

  return (
    <div className="complaint-card">
      <div className="complaint-header">
        <div>
          <div className="complaint-title">{complaint.title}</div>
          <div className="complaint-meta">
            <span><User size={12} /> {complaint.name}</span>
            <span><MapPin size={12} /> {complaint.location}</span>
            <span><Tag size={12} /> {complaint.category}</span>
            <span><Calendar size={12} /> {timeAgo(complaint.createdAt)}</span>
          </div>
        </div>
        <StatusBadge status={complaint.status} />
      </div>

      <p className="complaint-desc">
        {complaint.description.length > 140
          ? complaint.description.slice(0, 140) + '...'
          : complaint.description}
      </p>

      {complaint.aiPriority && (
        <div className="ai-result">
          <h4><Brain size={13} /> AI Analysis</h4>
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
        </div>
      )}

      <div className="complaint-footer">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate(`/complaints/${complaint._id}`)}
          >
            View Details
          </button>
          {onAnalyze && (
            <button
              className="btn btn-sm"
              style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)' }}
              onClick={() => onAnalyze(complaint._id)}
            >
              <Brain size={13} /> AI Analyze
            </button>
          )}
        </div>

        {isAdmin && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => navigate(`/update/${complaint._id}`)}
            >
              <Edit size={13} /> Update
            </button>
            <button className="btn btn-danger btn-sm" onClick={handleDelete}>
              <Trash2 size={13} /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
