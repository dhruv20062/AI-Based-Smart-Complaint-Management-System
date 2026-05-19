import { useState, useEffect, useCallback } from 'react';
import { getAllComplaints, analyzeComplaint } from '../services/api';
import ComplaintCard from '../components/ComplaintCard';
import toast from 'react-hot-toast';
import { Search, Brain, List, RefreshCw } from 'lucide-react';

const CATEGORIES = ['', 'Water Supply', 'Electricity', 'Roads', 'Garbage', 'Sanitation', 'Public Safety', 'Other'];
const STATUSES = ['', 'Pending', 'In Progress', 'Resolved', 'Rejected'];

export default function ComplaintList() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (category) params.category = category;
      if (status) params.status = status;

      const { data } = await getAllComplaints(params);
      let list = data.data;

      // Client-side location filter
      if (locationSearch.trim()) {
        list = list.filter((c) =>
          c.location.toLowerCase().includes(locationSearch.toLowerCase())
        );
      }

      setComplaints(list);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  }, [category, status, page, locationSearch]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleAnalyze = async (id) => {
    try {
      toast.loading('Analyzing with AI...', { id: 'ai' });
      await analyzeComplaint(id);
      toast.success('AI analysis complete!', { id: 'ai' });
      fetchComplaints();
    } catch {
      toast.error('AI analysis failed', { id: 'ai' });
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>All Complaints</h1>
          <p>{total} complaints found</p>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              id="location-search"
              style={{ paddingLeft: 34, width: '100%' }}
              className="form-control"
              placeholder="Search by location..."
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
            />
          </div>

          <select
            id="category-filter"
            className="form-control"
            style={{ width: 'auto', minWidth: 150 }}
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          >
            <option value="">All Categories</option>
            {CATEGORIES.filter(Boolean).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            id="status-filter"
            className="form-control"
            style={{ width: 'auto', minWidth: 140 }}
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          >
            <option value="">All Statuses</option>
            {STATUSES.filter(Boolean).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          <button className="btn btn-secondary btn-sm" onClick={fetchComplaints} id="refresh-btn">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <span className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
            <p style={{ color: '#64748b', marginTop: 16 }}>Loading complaints...</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="empty-state">
            <List size={60} />
            <h3>No complaints found</h3>
            <p>Try adjusting your filters or submit a new complaint.</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {complaints.map((c) => (
              <ComplaintCard
                key={c._id}
                complaint={c}
                onRefresh={fetchComplaints}
                onAnalyze={handleAnalyze}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button className="page-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)} id="prev-page-btn">
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p} className={`page-btn${page === p ? ' active' : ''}`}
                onClick={() => setPage(p)} id={`page-btn-${p}`}
              >
                {p}
              </button>
            ))}
            <button className="page-btn" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} id="next-page-btn">
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
