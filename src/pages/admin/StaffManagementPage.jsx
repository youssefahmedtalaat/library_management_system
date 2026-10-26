import React, { useState } from 'react';
import { Plus, Mail, CheckCircle2, X } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import StatusBadge from '../../components/StatusBadge';
import { getStaffName, getStaffRoleTitle } from '../../data/mockData';

export default function StaffManagementPage() {
  const { staff, addStaffMember, lang } = useLibrary();

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

    let roleTitleAr = 'أمين مكتبة';
    let roleTitleEn = 'Librarian';
    if (formData.role === 'admin') {
      roleTitleAr = 'مدير نظام المكتبة';
      roleTitleEn = 'Library System Admin';
    } else if (formData.role === 'cataloger') {
      roleTitleAr = 'مشرف الفهرسة والتصنيف';
      roleTitleEn = 'Cataloging Specialist';
    } else if (formData.role === 'librarian') {
      roleTitleAr = 'أمين الإعارة والتداول';
      roleTitleEn = 'Circulation & Lending Librarian';
    }

    addStaffMember({
      ...formData,
      full_name_ar: formData.full_name,
      full_name_en: formData.full_name,
      role_title: roleTitleAr,
      role_title_ar: roleTitleAr,
      role_title_en: roleTitleEn
    });

    setShowModal(false);
    setFormData({
      full_name: '',
      email: '',
      role: 'librarian',
      role_title: 'أمين الإعارة والتداول'
    });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ maxWidth: '1360px', width: '100%', display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 2px 0' }}>
            {lang === 'en' ? 'Staff Accounts & Permissions Management' : 'إدارة حسابات الموظفين والصلاحيات'}
          </h1>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {lang === 'en'
              ? 'Add and administer librarians, catalogers, and system administrators, and manage circulation desk privileges.'
              : 'إضافة وإدارة أمناء المكتبة، ومشرفي الفهرسة، ومديري النظام وضبط أذونات التداول.'}
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <Plus size={16} />
          <span>{lang === 'en' ? 'Add Staff Member' : 'إضافة حساب موظف جديد'}</span>
        </button>
      </div>

      {/* Staff Table */}
      <div className="card" style={{ padding: '20px', backgroundColor: 'var(--bg-surface)' }}>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>{lang === 'en' ? 'Staff Member' : 'الموظف'}</th>
                <th>{lang === 'en' ? 'Email' : 'البريد الإلكتروني'}</th>
                <th>{lang === 'en' ? 'Role' : 'الدور والصلاحية'}</th>
                <th>{lang === 'en' ? 'Job Title' : 'المسمى الوظيفي'}</th>
                <th>{lang === 'en' ? 'Last Login' : 'آخر تسجيل دخول'}</th>
                <th>{lang === 'en' ? 'Account Status' : 'حالة الحساب'}</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => {
                const name = getStaffName(s, lang);
                const roleTitle = getStaffRoleTitle(s, lang);

                return (
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
                          {name.charAt(0)}
                        </div>
                        <strong style={{ fontSize: '0.92rem' }}>{name}</strong>
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
                    <td>{roleTitle}</td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {formatDate(s.last_login)}
                    </td>
                    <td>
                      <StatusBadge status={s.status} size="sm" />
                    </td>
                  </tr>
                );
              })}
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
                {lang === 'en' ? 'Create New Staff Account' : 'إنشاء حساب موظف جديد'}
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
                <label className="form-label">{lang === 'en' ? 'Full Name:' : 'الاسم الكامل للموظف:'}</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={lang === 'en' ? 'e.g. Abdullah Al-Saadi' : 'مثال: عبد الله السعدي'}
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">{lang === 'en' ? 'Institutional Email:' : 'البريد الإلكتروني المؤسسي:'}</label>
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
                <label className="form-label">{lang === 'en' ? 'Role & Permissions:' : 'الدور الوظيفي والصلاحية:'}</label>
                <select
                  className="form-select"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="librarian">{lang === 'en' ? 'Circulation Desk Librarian' : 'أمين الإعارة والتداول'}</option>
                  <option value="cataloger">{lang === 'en' ? 'Cataloging & Inventory Specialist' : 'مشرف الفهرسة وإدارة النسخ'}</option>
                  <option value="admin">{lang === 'en' ? 'System & Library Admin' : 'مدير النظام والمكتبة'}</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  {lang === 'en' ? 'Cancel' : 'إلغاء'}
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle2 size={16} />
                  <span>{lang === 'en' ? 'Create Account' : 'إنشاء الحساب'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
