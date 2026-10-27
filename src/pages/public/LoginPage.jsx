import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  BookOpen, Eye, EyeOff, Sparkles, ArrowRight,
  User, Layers, Shield, Globe, Sun, Moon, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLibrary } from '../../context/LibraryContext';

const demoAccounts = [
  {
    role: 'member',
    icon: User,
    label: 'Member',
    label_ar: 'عضو',
    name: 'Ahmed Al-Tamimi',
    name_ar: 'أحمد التميمي',
    email: 'ahmed@library.sa',
    password: 'member123',
    color: '#3B82F6',
    desc: 'Browse catalog & place holds',
    desc_ar: 'تصفح الفهرس وتقديم طلبات الحجز',
    redirect: '/'
  },
  {
    role: 'librarian',
    icon: Layers,
    label: 'Librarian',
    label_ar: 'أمين المكتبة',
    name: 'Sulaiman Al-Abdali',
    name_ar: 'سليمان العبدلي',
    email: 'sulaiman@library.sa',
    password: 'librarian123',
    color: '#8B5CF6',
    desc: 'Circulation desk & catalog management',
    desc_ar: 'مكتب الإعارة وإدارة الفهرس',
    redirect: '/librarian'
  },
  {
    role: 'admin',
    icon: Shield,
    label: 'Admin',
    label_ar: 'مدير النظام',
    name: 'Dr. Hesham Al-Qasimi',
    name_ar: 'د. هشام القاسمي',
    email: 'hesham@library.sa',
    password: 'admin123',
    color: '#F59E0B',
    desc: 'Staff management & system policies',
    desc_ar: 'إدارة الموظفين وسياسات النظام',
    redirect: '/admin'
  }
];

export default function LoginPage() {
  const { login, authError, clearAuthError, isAuthenticated, currentUser } = useAuth();
  const { lang, toggleLang, theme, toggleTheme } = useLibrary();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isAr = lang === 'ar';
  const from = location.state?.from?.pathname || null;

  // If already logged in, redirect appropriately
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const dest = from || (currentUser.role === 'admin' ? '/admin' : currentUser.role === 'librarian' ? '/librarian' : '/');
      navigate(dest, { replace: true });
    }
  }, [isAuthenticated, currentUser, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearAuthError();
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 600)); // brief loading feel
    const result = login(email, password);
    setIsLoading(false);

    if (result.success) {
      const dest = from ||
        (result.role === 'admin' ? '/admin' : result.role === 'librarian' ? '/librarian' : '/');
      navigate(dest, { replace: true });
    }
  };

  const handleDemoLogin = async (account) => {
    clearAuthError();
    setIsLoading(true);
    setEmail(account.email);
    setPassword(account.password);
    await new Promise((r) => setTimeout(r, 500));
    const result = login(account.email, account.password);
    setIsLoading(false);
    if (result.success) {
      navigate(account.redirect, { replace: true });
    }
  };

  return (
    <div className="login-page" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Animated background blobs */}
      <div className="login-bg-blob login-bg-blob-1" />
      <div className="login-bg-blob login-bg-blob-2" />
      <div className="login-bg-blob login-bg-blob-3" />

      {/* Top-right controls */}
      <div className="login-controls">
        <button className="login-ctrl-btn" onClick={toggleTheme} title={isAr ? 'تبديل السمة' : 'Toggle theme'}>
          {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
        </button>
        <button className="login-ctrl-btn" onClick={toggleLang} title={isAr ? 'Switch to English' : 'التحويل للعربية'}>
          <Globe size={17} />
          <span>{isAr ? 'EN' : 'ع'}</span>
        </button>
        <Link to="/" className="login-ctrl-btn login-ctrl-link">
          {isAr ? 'الموقع الرئيسي ←' : '← Public Site'}
        </Link>
      </div>

      {/* Card */}
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo-area">
          <div className="login-logo-icon">
            <BookOpen size={26} />
            <div className="login-logo-sparkle"><Sparkles size={12} /></div>
          </div>
          <div className="login-logo-text">
            <span className="login-logo-title">{isAr ? 'المكتبة الذكية' : 'Smart Library'}</span>
            <span className="login-logo-sub">LMS 2026</span>
          </div>
        </div>

        <div className="login-card-body">
          <h1 className="login-heading">
            {isAr ? 'تسجيل الدخول' : 'Sign In'}
          </h1>
          <p className="login-subheading">
            {isAr
              ? 'أدخل بياناتك للوصول إلى حسابك'
              : 'Enter your credentials to access your account'}
          </p>

          {/* Error */}
          {authError === 'invalid_credentials' && (
            <div className="login-error-banner">
              <AlertCircle size={15} />
              <span>{isAr ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' : 'Invalid email or password. Please try again.'}</span>
            </div>
          )}

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label className="login-label">
                {isAr ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <input
                id="login-email"
                type="email"
                className="login-input"
                placeholder={isAr ? 'name@library.sa' : 'name@library.sa'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                dir="ltr"
              />
            </div>

            <div className="login-field">
              <label className="login-label">
                {isAr ? 'كلمة المرور' : 'Password'}
              </label>
              <div className="login-password-wrapper">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  dir="ltr"
                />
                <button
                  type="button"
                  className="login-pw-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              className={`login-submit-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="login-spinner" />
              ) : (
                <>
                  <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="login-divider">
            <span>{isAr ? 'أو جرّب حساباً تجريبياً' : 'or use a demo account'}</span>
          </div>

          {/* Demo cards */}
          <div className="login-demo-cards">
            {demoAccounts.map((account) => {
              const Icon = account.icon;
              return (
                <button
                  key={account.role}
                  className="login-demo-card"
                  onClick={() => handleDemoLogin(account)}
                  disabled={isLoading}
                  style={{ '--demo-color': account.color }}
                  id={`demo-${account.role}-btn`}
                >
                  <div className="login-demo-icon" style={{ background: `${account.color}20`, color: account.color }}>
                    <Icon size={18} />
                  </div>
                  <div className="login-demo-info">
                    <span className="login-demo-role">{isAr ? account.label_ar : account.label}</span>
                    <span className="login-demo-name">{isAr ? account.name_ar : account.name}</span>
                    <span className="login-demo-desc">{isAr ? account.desc_ar : account.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
