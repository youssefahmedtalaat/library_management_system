import React, { useState } from 'react';
import { Search, User } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';

export default function AuditLogPage() {
  const { auditLogs } = useLibrary();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');

  const filtered = auditLogs.filter((log) => {
    if (filterAction !== 'all' && log.action !== filterAction) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        log.actor.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.entity_id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div style={{ maxWidth: '1360px', width: '100%', display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 2px 0' }}>
          سجل التدقيق والإجراءات الرقابية (Audit Logs)
        </h1>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          توثيق زمني غير قابل للتعديل لجميع العمليات الحساسة من إعارة، استرجاع، تجديد، تسوية غرامات، وتعديل سياسات.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px 20px', backgroundColor: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 280px' }}>
            <Search
              size={18}
              style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '12px', color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              className="form-input"
              placeholder="ابحث بالاسم، تفاصيل الإجراء، أو رمز الكيان..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingRight: '38px' }}
            />
          </div>

          <div style={{ flex: '0 1 200px' }}>
            <select
              className="form-select"
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
            >
              <option value="all">جميع الإجراءات</option>
              <option value="تسجيل إعارة">تسجيل إعارة</option>
              <option value="تجديد إعارة">تجديد إعارة</option>
              <option value="إرجاع نسخة">إرجاع نسخة</option>
              <option value="تسجيل حجز عنوان">تسجيل حجز عنوان</option>
              <option value="تسوية غرامة">تسوية غرامة</option>
              <option value="إضافة عنوان جديد">إضافة عنوان جديد</option>
              <option value="تحديث سياسات النظام">تحديث سياسات النظام</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="card" style={{ padding: '20px', backgroundColor: 'var(--bg-surface)' }}>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>التاريخ والوقت</th>
                <th>المستخدم المنفذ</th>
                <th>الدور</th>
                <th>نوع الإجراء</th>
                <th>الكيان المستهدف</th>
                <th>تفاصيل الإجراء</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
                    {new Date(log.created_at).toLocaleString('ar-EG')}
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                      <User size={14} color="var(--color-primary)" />
                      {log.actor}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                      {log.actor_role}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '3px 8px',
                        backgroundColor: 'var(--color-primary-subtle)',
                        color: 'var(--color-primary)',
                        borderRadius: 'var(--radius-xs)',
                        fontWeight: 700,
                        fontSize: '0.78rem'
                      }}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                    {log.entity_type} #{log.entity_id}
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                    {log.details}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    لا توجد سجلات مطابقة للبحث.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
