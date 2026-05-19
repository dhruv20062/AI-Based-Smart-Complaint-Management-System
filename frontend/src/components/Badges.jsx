import { Clock, CheckCircle, AlertTriangle, XCircle, Zap } from 'lucide-react';

const statusConfig = {
  Pending: { cls: 'badge-pending', icon: <Clock size={11} /> },
  'In Progress': { cls: 'badge-progress', icon: <Zap size={11} /> },
  Resolved: { cls: 'badge-resolved', icon: <CheckCircle size={11} /> },
  Rejected: { cls: 'badge-rejected', icon: <XCircle size={11} /> },
};

const priorityConfig = {
  Low: 'badge-low',
  Medium: 'badge-medium',
  High: 'badge-high',
  Critical: 'badge-critical',
};

export function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.Pending;
  return (
    <span className={`badge ${cfg.cls}`}>
      {cfg.icon} {status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  if (!priority) return null;
  return (
    <span className={`badge ${priorityConfig[priority] || 'badge-medium'}`}>
      <AlertTriangle size={11} /> {priority}
    </span>
  );
}
