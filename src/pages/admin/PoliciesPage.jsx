import React, { useState } from 'react';
import { Settings, ShieldCheck, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';

export default function PoliciesPage() {
  const { policies, updatePolicies } = useLibrary();

  const [formState, setFormState] = useState({ ...policies });

  const handleChange = (field, val) => {
    setFormState((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updatePolicies(formState);
  };

  return (
    <div style={{ padding: '24px 20px', maxWidth: '1360px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 4px 0' }}>
          سياسات وقواعد التداول والإعارة
        </h1>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          تحديد الحدود القصوى للاستعارة، مدد الإعارات، مهل الحجز، رسوم التأخير، وإعدادات الذكاء الاصطناعي.
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* Circulation Limits Card */}
        <div className="card" style={{ padding: '24px', backgroundColor: 'var(--bg-surface)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} color="var(--color-primary)" />
            قواعد الإعارة والتجديد
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">
                الحد الأقصى للكتب المعارة في وقت واحد لكل عضو:
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>كتب</span>
              </label>
              <input
                type="number"
                min="1"
                max="10"
                className="form-input"
                value={formState.max_borrow_limit}
                onChange={(e) => handleChange('max_borrow_limit', parseInt(e.target.value, 10))}
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">
                المدة الافتراضية للإعارة:
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>أيام</span>
              </label>
              <input
                type="number"
                min="1"
                max="60"
                className="form-input"
                value={formState.default_loan_days}
                onChange={(e) => handleChange('default_loan_days', parseInt(e.target.value, 10))}
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">
                الحد الأقصى لمرات التجديد المسموحة لكل كتاب:
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>مرات</span>
              </label>
              <input
                type="number"
                min="0"
                max="5"
                className="form-input"
                value={formState.max_renewals}
                onChange={(e) => handleChange('max_renewals', parseInt(e.target.value, 10))}
                required
              />
            </div>
          </div>
        </div>

        {/* Fines & Reservations Card */}
        <div className="card" style={{ padding: '24px', backgroundColor: 'var(--bg-surface)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={20} color="var(--color-primary)" />
            رسوم التأخير ومهل طوابير الحجز
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">
                غرامة التأخير اليومية عن كل نسخة متأخرة:
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>ر.س / يوم</span>
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                className="form-input"
                value={formState.fine_per_day}
                onChange={(e) => handleChange('fine_per_day', parseFloat(e.target.value))}
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">
                مهلة استلام النسخة المحجوزة قبل إلغائها للعضو التالي:
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>ساعات</span>
              </label>
              <input
                type="number"
                min="12"
                max="168"
                className="form-input"
                value={formState.reservation_expiry_hours}
                onChange={(e) => handleChange('reservation_expiry_hours', parseInt(e.target.value, 10))}
                required
              />
            </div>

            {/* AI Assistant toggle */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                backgroundColor: 'var(--color-ai-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-ai-border)',
                marginTop: '6px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="var(--color-ai-accent)" />
                <div>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--color-ai-accent)', display: 'block' }}>
                    تفعيل أمين المكتبة الذكي (AI Assistant)
                  </strong>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                    تمكين الأعضاء من استكشاف الفهرس وفهم سياسات الإعارة
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formState.enable_ai_librarian}
                onChange={(e) => handleChange('enable_ai_librarian', e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--color-ai-accent)' }}
              />
            </div>
          </div>
        </div>

        {/* Action button */}
        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setFormState({ ...policies })}
          >
            <RotateCcw size={16} />
            <span>إعادة التعيين</span>
          </button>
          <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px' }}>
            <CheckCircle2 size={18} />
            <span>حفظ واعتماد التعديلات</span>
          </button>
        </div>
      </form>
    </div>
  );
}
