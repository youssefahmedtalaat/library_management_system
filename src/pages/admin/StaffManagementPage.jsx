import React, { useState } from 'react';
import { Plus, Mail, CheckCircle2, X } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import StatusBadge from '../../components/StatusBadge';

export default function StaffManagementPage() {
  const { staff, addStaffMember } = useLibrary();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    role: 'librarian',
    role_title: 'أمين الإعارة والتداول'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email) return;

    let roleTitle = 'أمين مكتبة';
    if (formData.role === 'admin') roleTitle = 'مدير نظام المكتبة';
    else if (formData.role === 'cataloger') roleTitle = 'مشرف الفهرسة والتصنيف';
    else if (formData.role === 'librarian') roleTitle = 'أمين الإعارة والتداول';

    addStaffMember({
      ...formData,
      role_title: roleTitle
    });

    setShowModal(false);
    setFormData({
      full_name: '',
      email: '',
      role: 'librarian',
      role_title: 'أمين الإعارة والتداول'
    });
  };

  return (
    <div style={{ padding: '24px 20px', maxWidth: '1360px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 4px 0' }}>
            إدارة حسابات الموظفين والصلاحيات
          </h1>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            إضافة وإدارة أمناء المكتبة، ومشرفي الفهرسة، ومديري النظام وضبط أذونات التداول.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <Plus size={16} />
          <span>إضافة حساب موظف جديد</span>
        </button>
      </div>

      {/* Staff Table */}
      <div className="card" style={{ padding: '20px', backgroundColor: 'var(--bg-surface)' }}>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>الموظف</th>
                <th>البريد الإلكتروني</th>
                <th>الدور والصلاحية</th>
                <th>المسمى الوظيفي</th>
                <th>آخر تسجيل دخول</th>
                <th>حالة الحساب</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--color-primary-subtle)',
                          color: 'var(--color-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.85rem'
                        }}
                      >
                        {s.full_name.charAt(0)}
                      </div>
                      <strong style={{ fontSize: '0.92rem' }}>{s.full_name}</strong>
                    </div>
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <Mail size={13} />
                      {s.email}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-neutral" style={{ fontWeight: 700 }}>
                      {s.role}
                    </span>
                  </td>
                  <td>{s.role_title}</td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {new Date(s.last_login).toLocaleString('ar-EG')}
                  </td>
                  <td>
                    <StatusBadge status={s.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--bg-surface)'
              }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                إنشاء حساب موظف جديد
              </h3>
              <button
                type="button"
                className="btn btn-secondary btn-icon"
                onClick={() => setShowModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">الاسم الكامل للموظف:</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="مثال: عبد الله السعدي"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">البريد الإلكتروني المؤسسي:</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="employee@library.gov.sa"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">الدور الوظيفي والصلاحية:</label>
                <select
                  className="form-select"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="librarian">أمين الإعارة والتداول (Librarian)</option>
                  <option value="cataloger">مشرف الفهرسة وإدارة النسخ (Cataloger)</option>
                  <option value="admin">مدير النظام والمكتبة (System Admin)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  إلغاء
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle2 size={16} />
                  <span>إنشاء الحساب</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
