import React, { useState } from 'react';
import { Search, User } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { getAuditAction, getAuditRole, getAuditEntity } from '../../data/translations';

export default function AuditLogPage() {
  const { auditLogs, lang, t } = useLibrary();
  const isRtl = lang === 'ar';

  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');

  const actionOptions = [
    { value: 'all', label: t('auditPage.actions.all') },
    { value: 'تسجيل إعارة', label: t('auditPage.actions.issueLoan') },
    { value: 'تجديد إعارة', label: t('auditPage.actions.renewLoan') },
    { value: 'إرجاع نسخة', label: t('auditPage.actions.returnCopy') },
    { value: 'تسجيل حجز عنوان', label: t('auditPage.actions.placeHold') },
    { value: 'إلغاء حجز', label: t('auditPage.actions.cancelHold') },
    { value: 'تسوية غرامة', label: t('auditPage.actions.settleFine') },
    { value: 'احتساب غرامة تأخير', label: t('auditPage.actions.assessFine') },
    { value: 'إضافة عنوان جديد', label: t('auditPage.actions.addNewBook') },
    { value: 'تحديث سياسات النظام', label: t('auditPage.actions.updatePolicies') },
    { value: 'تعديل السياسات', label: t('auditPage.actions.modifyPolicies') },
  ];

  const filtered = auditLogs.filter((log) => {
    if (filterAction !== 'all') {
      if (log.action !== filterAction && log.action_en !== filterAction) return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const actor = (lang === 'en' ? (log.actor_en || log.actor) : log.actor).toLowerCase();
      const details = (lang === 'en' ? (log.details_en || log.details) : log.details).toLowerCase();
      const action = getAuditAction(log.action, lang).toLowerCase();
      const entityId = (log.entity_id || '').toLowerCase();
      return (
        actor.includes(q) ||
        details.includes(q) ||
        action.includes(q) ||
        entityId.includes(q)
      );
    }
    return true;
  });

  return (
    <div style={{ maxWidth: '1360px', width: '100%', display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 4px 0' }}>
          {t('auditPage.title')}
        </h1>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {t('auditPage.desc')}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px 20px', backgroundColor: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 280px' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                [isRtl ? 'right' : 'left']: '12px',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              className="form-input"
              placeholder={t('auditPage.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                paddingRight: isRtl ? '38px' : '14px',
                paddingLeft: isRtl ? '14px' : '38px',
              }}
            />
          </div>

          <div style={{ flex: '0 1 220px' }}>
            <select
              className="form-select"
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
            >
              {actionOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
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
                <th>{t('auditPage.timeCol')}</th>
                <th>{t('auditPage.actorCol')}</th>
                <th>{t('auditPage.roleCol')}</th>
                <th>{t('auditPage.actionCol')}</th>
                <th>{t('auditPage.entityCol')}</th>
                <th>{t('auditPage.detailsCol')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => {
                const actorName = lang === 'en' ? (log.actor_en || log.actor) : log.actor;
                const actionLabel = lang === 'en' ? (log.action_en || getAuditAction(log.action, 'en')) : log.action;
                const detailsText = lang === 'en' ? (log.details_en || log.details) : log.details;
                const roleLabel = getAuditRole(log.actor_role, lang);
                const entityLabel = `${getAuditEntity(log.entity_type, lang)} #${log.entity_id}`;
                const formattedDate = lang === 'ar'
                  ? new Date(log.created_at).toLocaleString('ar-EG')
                  : new Date(log.created_at).toLocaleString('en-US');

                return (
                  <tr key={log.id}>
                    <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
                      {formattedDate}
                    </td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                        <User size={14} color="var(--color-primary)" />
                        {actorName}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                        {roleLabel}
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
                        {actionLabel}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      {entityLabel}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                      {detailsText}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    {t('auditPage.noLogs')}
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
