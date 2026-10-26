import React from 'react';
import { CheckCircle2, Clock, BookOpen, AlertCircle, Wrench, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';

export default function StatusBadge({ status, text, size = 'md' }) {
  const { lang } = useLibrary();
  let badgeClass = 'badge-neutral';
  let Icon = null;

  const defaultLabels = {
    available: lang === 'en' ? 'Available' : 'متاح',
    reserved: lang === 'en' ? 'Reserved' : 'محجوز',
    due_soon: lang === 'en' ? 'Due Soon' : 'قريب الاستحقاق',
    borrowed: lang === 'en' ? 'Borrowed' : 'مُعار',
    issued: lang === 'en' ? 'Issued' : 'مُعار',
    overdue: lang === 'en' ? 'Overdue' : 'متأخر',
    maintenance: lang === 'en' ? 'Maintenance' : 'صيانة وتجليد',
    active: lang === 'en' ? 'Active' : 'نشط',
    blocked: lang === 'en' ? 'Blocked' : 'موقوف',
    paid: lang === 'en' ? 'Paid' : 'مسدد',
    unpaid: lang === 'en' ? 'Unpaid' : 'غير مسدد',
  };

  switch (status) {
    case 'available':
      badgeClass = 'badge-available';
      Icon = CheckCircle2;
      break;
    case 'reserved':
    case 'due_soon':
      badgeClass = 'badge-reserved';
      Icon = Clock;
      break;
    case 'borrowed':
    case 'issued':
      badgeClass = 'badge-borrowed';
      Icon = BookOpen;
      break;
    case 'overdue':
      badgeClass = 'badge-overdue';
      Icon = AlertCircle;
      break;
    case 'maintenance':
      badgeClass = 'badge-neutral';
      Icon = Wrench;
      break;
    case 'active':
      badgeClass = 'badge-available';
      Icon = ShieldCheck;
      break;
    case 'blocked':
      badgeClass = 'badge-overdue';
      Icon = ShieldAlert;
      break;
    case 'paid':
      badgeClass = 'badge-available';
      Icon = CheckCircle2;
      break;
    case 'unpaid':
      badgeClass = 'badge-overdue';
      Icon = AlertCircle;
      break;
    default:
      badgeClass = 'badge-neutral';
  }

  let label = text;
  if (typeof text === 'object' && text !== null) {
    label = text[lang] || text.ar || text.en;
  } else if (!text) {
    label = defaultLabels[status] || status;
  }

  const sizeClass = size === 'sm' ? 'btn-sm' : '';

  return (
    <span className={`badge ${badgeClass} ${sizeClass}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
      {Icon && <Icon size={size === 'sm' ? 12 : 14} />}
      <span>{label}</span>
    </span>
  );
}
