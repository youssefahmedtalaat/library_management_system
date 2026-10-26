import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useLibrary();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 1000,
        maxWidth: '380px',
        width: '100%',
        pointerEvents: 'none'
      }}
    >
      {toasts.map((toast) => {
        let borderColor = 'var(--border-subtle)';
        let bgIconColor = 'var(--color-primary)';
        let Icon = Info;

        if (toast.type === 'success') {
          borderColor = 'var(--status-available-border)';
          bgIconColor = 'var(--status-available-text)';
          Icon = CheckCircle2;
        } else if (toast.type === 'error') {
          borderColor = 'var(--status-overdue-border)';
          bgIconColor = 'var(--status-overdue-text)';
          Icon = XCircle;
        } else if (toast.type === 'warning') {
          borderColor = 'var(--status-reserved-border)';
          bgIconColor = 'var(--status-reserved-text)';
          Icon = AlertTriangle;
        }

        return (
          <div
            key={toast.id}
            className="card"
            style={{
              padding: '14px 16px',
              borderLeft: `4px solid ${borderColor}`,
              backgroundColor: 'var(--bg-surface)',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              pointerEvents: 'auto',
              animation: 'slideUp 0.25s ease-out'
            }}
          >
            <div style={{ color: bgIconColor, marginTop: '2px', flexShrink: 0 }}>
              <Icon size={18} />
            </div>

            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 3px 0', color: 'var(--text-primary)' }}>
                {toast.title}
              </h4>
              <p style={{ fontSize: '0.82rem', margin: 0, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {toast.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
