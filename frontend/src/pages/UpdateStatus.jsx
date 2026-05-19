import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getComplaintById, updateComplaintStatus } from '../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Edit, CheckCircle } from 'lucide-react';
import { StatusBadge } from '../components/Badges';

const STATUSES = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

export default function UpdateStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getComplaintById(id);
        setComplaint(data.data);
        setStatus(data.data.status);
      } catch {
        toast.error('Complaint not found');
        navigate('/complaints');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateComplaintStatus(id, { status });
      toast.success('Updated status shown');
      navigate(`/complaints/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed. Admin login required.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
    </div>
  );

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 560 }}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/complaints/${id}`)} style={{ marginBottom: 24 }} id="back-btn">
          <ArrowLeft size={15} /> Back
        </button>

        <div className="page-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <div style={{ background: 'rgba(99,102,241,0.1)', padding: 14, borderRadius: 16 }}>
              <Edit size={28} style={{ color: '#818cf8' }} />
            </div>
          </div>
          <h1>Update Status</h1>
          <p>Change the status of the complaint below</p>
        </div>

        <div className="card">
          {complaint && (
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 16, marginBottom: 24 }}>
              <p style={{ fontWeight: 700, marginBottom: 8 }}>{complaint.title}</p>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: 10 }}>{complaint.location} · {complaint.category}</p>
              <p style={{ color: '#64748b', fontSize: '0.82rem' }}>Current: <StatusBadge status={complaint.status} /></p>
            </div>
          )}

          <form onSubmit={handleUpdate} id="update-status-form">
            <div className="form-group">
              <label className="form-label" htmlFor="status-select">New Status</label>
              <select
                id="status-select" className="form-control"
                value={status} onChange={(e) => setStatus(e.target.value)}
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" id="save-status-btn" disabled={saving}>
              {saving ? (
                <><span className="spinner" /> Saving...</>
              ) : (
                <><CheckCircle size={17} /> Save Status</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
