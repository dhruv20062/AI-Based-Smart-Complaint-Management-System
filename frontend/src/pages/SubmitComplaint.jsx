import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addComplaint } from '../services/api';
import toast from 'react-hot-toast';
import { FileText, Send, Loader } from 'lucide-react';

const CATEGORIES = ['Water Supply', 'Electricity', 'Roads', 'Garbage', 'Sanitation', 'Public Safety', 'Other'];

const initialForm = {
  name: '',
  email: '',
  title: '',
  description: '',
  category: '',
  location: '',
};

export default function SubmitComplaint() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.title.trim()) errs.title = 'Complaint title is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.category) errs.category = 'Category is required';
    if (!form.location.trim()) errs.location = 'Location is required';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      const { data } = await addComplaint(form);
      toast.success('Complaint stored successfully!');
      navigate(`/complaints/${data.data._id}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit complaint';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 700 }}>
        <div className="page-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <div style={{ background: 'rgba(99,102,241,0.1)', padding: 14, borderRadius: 16 }}>
              <FileText size={28} style={{ color: '#818cf8' }} />
            </div>
          </div>
          <h1>Submit a Complaint</h1>
          <p>Fill in the details below. All fields are required.</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} id="complaint-form" noValidate>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full Name *</label>
                <input
                  id="name" name="name" type="text" className="form-control"
                  placeholder="Rahul Kumar" value={form.name} onChange={handleChange}
                />
                {errors.name && <p className="form-error">{errors.name}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address *</label>
                <input
                  id="email" name="email" type="email" className="form-control"
                  placeholder="rahul@gmail.com" value={form.email} onChange={handleChange}
                />
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="title">Complaint Title *</label>
              <input
                id="title" name="title" type="text" className="form-control"
                placeholder="e.g. Water Leakage Issue" value={form.title} onChange={handleChange}
              />
              {errors.title && <p className="form-error">{errors.title}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">Complaint Description *</label>
              <textarea
                id="description" name="description" className="form-control"
                placeholder="Describe the issue in detail..." value={form.description} onChange={handleChange}
                rows={4}
              />
              {errors.description && <p className="form-error">{errors.description}</p>}
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="category">Category *</label>
                <select id="category" name="category" className="form-control" value={form.category} onChange={handleChange}>
                  <option value="">Select Category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.category && <p className="form-error">{errors.category}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="location">Location *</label>
                <input
                  id="location" name="location" type="text" className="form-control"
                  placeholder="e.g. Ghaziabad" value={form.location} onChange={handleChange}
                />
                {errors.location && <p className="form-error">{errors.location}</p>}
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" id="submit-complaint-btn" disabled={loading}>
              {loading ? (
                <><span className="spinner" /> Submitting...</>
              ) : (
                <><Send size={17} /> Submit Complaint</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
