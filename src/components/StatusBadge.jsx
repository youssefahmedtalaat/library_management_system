import React from 'react';
import { CheckCircle2, Clock, BookOpen, AlertCircle, Wrench, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function StatusBadge({ status, text, size = 'md' }) {
  let badgeClass = 'badge-neutral';
  let Icon = null;
  let label = text;

  switch (status) {
    case 'available':
      badgeClass = 'badge-available';
      Icon = CheckCircle2;
      label = label || 'متاح (Available)';
      break;
    case 'reserved':
      badgeClass = 'badge-reserved';
      Icon = Clock;
      label = label || 'محجوز (Reserved)';
      break;
    case 'due_soon':
      badgeClass = 'badge-reserved';
      Icon = Clock;
      label = label || 'قريب الاستحقاق (Due Soon)';
      break;
    case 'borrowed':
    case 'issued':
      badgeClass = 'badge-borrowed';
      Icon = BookOpen;
      label = label || 'مُعار (Borrowed)';
      break;
    case 'overdue':
      badgeClass = 'badge-overdue';
      Icon = AlertCircle;
      label = label || 'متأخر (Overdue)';
      break;
    case 'maintenance':
      badgeClass = 'badge-neutral';
      Icon = Wrench;
      label = label || 'صيانة (Maintenance)';
      break;
    case 'active':
      badgeClass = 'badge-available';
      Icon = ShieldCheck;
      label = label || 'نشط (Active)';
      break;
    case 'blocked':
      badgeClass = 'badge-overdue';
      Icon = ShieldAlert;
      label = label || 'موقوف (Blocked)';
      break;
    case 'paid':
      badgeClass = 'badge-available';
      Icon = CheckCircle2;
      label = label || 'مسدد (Paid)';
      break;
    case 'unpaid':
      badgeClass = 'badge-overdue';
      Icon = AlertCircle;
      label = label || 'غير مسدد (Unpaid)';
      break;
    default:
      badgeClass = 'badge-neutral';
      label = label || status;
  }

  const sizeClass = size === 'sm' ? 'btn-sm' : '';

  return (
    <span className={`badge ${badgeClass} ${sizeClass}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
      {Icon && <Icon size={size === 'sm' ? 12 : 14} />}
      <span>{label}</span>
    </span>
  );
}
