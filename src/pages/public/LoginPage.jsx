import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  BookOpen, Eye, EyeOff, Sparkles, ArrowRight, X,
  User, Layers, Shield, Globe, Sun, Moon, AlertCircle,
  LogIn, UserPlus, CheckCircle2, Info
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
    email: 'admin@library.sa',
    password: 'admin123',
    color: '#F59E0B',
    desc: 'Staff management & system policies',
    desc_ar: 'إدارة الموظفين وسياسات النظام',
    redirect: '/admin'
  }
];

export default function LoginPage({ isModal = true, onClose }) {
  const { login, registerMember, authError, clearAuthError, isAuthenticated, currentUser } = useAuth();
  const { lang, toggleLang, theme, toggleTheme, addToast } = useLibrary();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState('login'); // 'login' | 'signup'

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sign up form state (members only)
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const isAr = lang === 'ar';
  const from = location.state?.from?.pathname || null;

  // Handle escape key to close popup
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (onClose) {
          onClose();
        } else {
          navigate('/');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, navigate]);

  // If already logged in, redirect appropriately
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const dest = from || (currentUser.role === 'admin' ? '/admin' : currentUser.role === 'librarian' ? '/librarian' : '/');
      navigate(dest, { replace: true });
    }
  }, [isAuthenticated, currentUser, navigate, from]);

  const handleClose = () => {
    navigate('/', { replace: true });
    if (onClose) {
      onClose();
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    clearAuthError();
    setLocalError('');
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 500));
    const result = login(email, password);
    setIsLoading(false);

    if (result.success) {
      const dest = from ||
        (result.role === 'admin' ? '/admin' : result.role === 'librarian' ? '/librarian' : '/');
      navigate(dest, { replace: true });
      addToast({
        type: 'success',
        title: isAr ? 'تم تسجيل الدخول بنجاح' : 'Signed In Successfully',
        message: isAr ? 'مرحباً بك مجدداً في نظام المكتبة' : 'Welcome back to the library system'
      });
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    clearAuthError();
    setLocalError('');

    if (signupPassword.length < 6) {
      setLocalError(isAr ? 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.' : 'Password must be at least 6 characters long.');
      return;
    }

    if (signupPassword !== confirmPassword) {
      setLocalError(isAr ? 'كلمتا المرور غير متطابقتين.' : 'Passwords do not match.');
      return;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const result = registerMember(fullName, signupEmail, signupPassword);
    setIsLoading(false);

    if (result.success) {
      addToast({
        type: 'success',
        title: isAr ? 'تم إنشاء حساب العضو بنجاح' : 'Member Account Created',
        message: isAr
          ? `مرحباً بك، ${fullName}! تم تفعيل عضويتك ويمكنك الآن استعارة وحجز الكتب.`
          : `Welcome, ${fullName}! Your member account is active and ready to reserve books.`
      });
      const dest = from || '/';
      navigate(dest, { replace: true });
    }
  };

  const handleDemoLogin = async (account) => {
    clearAuthError();
    setLocalError('');
    setIsLoading(true);
    setEmail(account.email);
    setPassword(account.password);
    await new Promise((r) => setTimeout(r, 450));
    const result = login(account.email, account.password);
    setIsLoading(false);
    if (result.success) {
      navigate(account.redirect, { replace: true });
    }
  };

  return (
    <div
      className="login-modal-overlay"
      dir={isAr ? 'rtl' : 'ltr'}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      {/* Centered Modal Card */}
      <div className="login-card login-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Top Header: Logo + Controls + Close Button */}
        <div className="login-logo-area">
          <div className="login-logo-icon">
            <BookOpen size={24} />
            <div className="login-logo-sparkle"><Sparkles size={11} /></div>
          </div>
          <div className="login-logo-text">
            <span className="login-logo-title">{isAr ? 'المكتبة الذكية' : 'Smart Library'}</span>
            <span className="login-logo-sub">LMS 2026</span>
          </div>

          <div className="login-card-top-actions">
            <button
              type="button"
              className="login-ctrl-mini-btn"
              onClick={toggleTheme}
              title={isAr ? 'تبديل المظهر' : 'Toggle theme'}
            >
              {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <button
              type="button"
              className="login-ctrl-mini-btn"
              onClick={toggleLang}
              title={isAr ? 'Switch to English' : 'التحويل للعربية'}
            >
              <Globe size={14} />
              <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>{isAr ? 'EN' : 'ع'}</span>
            </button>
            <button
              type="button"
              className="login-close-btn"
              onClick={handleClose}
              title={isAr ? 'إغلاق' : 'Close'}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Mode Switcher Tabs (Sign In vs Sign Up for Members) */}
        <div className="login-tabs-bar">
          <button
            type="button"
            className={`login-tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => {
              setMode('login');
              clearAuthError();
              setLocalError('');
            }}
          >
            <LogIn size={15} />
            <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
          </button>

          <button
            type="button"
            className={`login-tab-btn ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => {
              setMode('signup');
              clearAuthError();
              setLocalError('');
            }}
          >
            <UserPlus size={15} />
            <span>{isAr ? 'إنشاء حساب عضو' : 'Sign Up (Members)'}</span>
            <span className="login-tab-badge">{isAr ? 'للأعضاء' : 'Members'}</span>
          </button>
        </div>

        <div className="login-card-body">
          {/* Error Banners */}
          {(authError === 'invalid_credentials' || authError === 'email_exists' || localError) && (
            <div className="login-error-banner">
              <AlertCircle size={16} />
              <span>
                {localError ||
                  (authError === 'email_exists'
                    ? (isAr ? 'هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول.' : 'This email is already registered. Please sign in.')
                    : (isAr ? 'بيانات الاعتماد غير صحيحة. يرجى التأكد من البريد وكلمة المرور.' : 'Invalid credentials. Please check your email and password.'))}
              </span>
            </div>
          )}

          {/* ─── TAB 1: SIGN IN FORM ─── */}
          {mode === 'login' && (
            <>
              <div className="login-intro">
                <h2 className="login-heading">
                  {isAr ? 'أهلاً بك مجدداً' : 'Welcome Back'}
                </h2>
                <p className="login-subheading">
                  {isAr
                    ? 'أدخل بياناتك للوصول إلى حسابك (أعضاء، أمناء مكتبة، إدارة)'
                    : 'Enter your credentials to access your account'}
                </p>
              </div>

              <form className="login-form" onSubmit={handleLoginSubmit}>
                <div className="login-field">
                  <label className="login-label">
                    {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    className="login-input"
                    placeholder="name@library.sa"
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
                      <span>{isAr ? 'دخول' : 'Sign In'}</span>
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </form>

              {/* Demo Accounts Divider */}
              <div className="login-divider">
                <span>{isAr ? 'أو دخول سريع بحساب تجريبي' : 'or quick access with demo accounts'}</span>
              </div>

              {/* Demo Cards */}
              <div className="login-demo-cards">
                {demoAccounts.map((account) => {
                  const Icon = account.icon;
                  return (
                    <button
                      key={account.role}
                      type="button"
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

              {/* Switch to Sign Up */}
              <div className="login-switch-footer">
                <span>{isAr ? 'ليس لديك حساب عضو؟' : "Don't have a member account?"}</span>
                <button
                  type="button"
                  className="login-switch-btn"
                  onClick={() => {
                    setMode('signup');
                    clearAuthError();
                    setLocalError('');
                  }}
                >
                  {isAr ? 'سجل كعضو جديد الآن ←' : 'Sign up as a Member →'}
                </button>
              </div>
            </>
          )}

          {/* ─── TAB 2: SIGN UP FORM (MEMBERS ONLY) ─── */}
          {mode === 'signup' && (
            <>
              <div className="login-intro">
                <h2 className="login-heading">
                  {isAr ? 'إنشاء حساب عضو جديد' : 'New Member Registration'}
                </h2>
                <p className="login-subheading">
                  {isAr
                    ? 'انضم إلى مجتمع قراء وباحثي المكتبة الذكية للاستعارة وحجز الكتب'
                    : 'Join our readers & researchers community to borrow books and join waitlists'}
                </p>
              </div>

              {/* Members-only notice pill */}
              <div className="signup-members-notice">
                <Info size={16} className="notice-icon" />
                <span>
                  {isAr
                    ? 'خاص بالمستفيدين والأعضاء فقط. حسابات أمناء المكتبة والإدارة تنشأ مركزياً بواسطة مسؤول النظام.'
                    : 'Exclusively for library members. Librarian and Admin accounts are provisioned administratively.'}
                </span>
              </div>

              <form className="login-form" onSubmit={handleSignupSubmit}>
                <div className="login-field">
                  <label className="login-label">
                    {isAr ? 'الاسم الكامل' : 'Full Name'}
                  </label>
                  <input
                    id="signup-name"
                    type="text"
                    className="login-input"
                    placeholder={isAr ? 'مثال: سارة المنصور' : 'e.g. Sara Al-Mansoor'}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    autoComplete="name"
                  />
                </div>

                <div className="login-field">
                  <label className="login-label">
                    {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    className="login-input"
                    placeholder="name@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    autoComplete="email"
                    dir="ltr"
                  />
                </div>

                <div className="signup-password-row">
                  <div className="login-field">
                    <label className="login-label">
                      {isAr ? 'كلمة المرور' : 'Password'}
                    </label>
                    <div className="login-password-wrapper">
                      <input
                        id="signup-password"
                        type={showSignupPassword ? 'text' : 'password'}
                        className="login-input"
                        placeholder={isAr ? '6 أحرف على الأقل' : 'At least 6 characters'}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                        dir="ltr"
                      />
                      <button
                        type="button"
                        className="login-pw-toggle"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        aria-label="Toggle password"
                      >
                        {showSignupPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="login-field">
                    <label className="login-label">
                      {isAr ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                    </label>
                    <input
                      id="signup-confirm-password"
                      type="password"
                      className="login-input"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      dir="ltr"
                    />
                  </div>
                </div>

                <button
                  id="signup-submit-btn"
                  type="submit"
                  className={`login-submit-btn ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="login-spinner" />
                  ) : (
                    <>
                      <CheckCircle2 size={17} />
                      <span>{isAr ? 'إنشاء حساب عضوية فوري' : 'Create Member Account'}</span>
                    </>
                  )}
                </button>
              </form>

              {/* Switch back to Sign In */}
              <div className="login-switch-footer">
                <span>{isAr ? 'لديك حساب بالفعل؟' : 'Already have an account?'}</span>
                <button
                  type="button"
                  className="login-switch-btn"
                  onClick={() => {
                    setMode('login');
                    clearAuthError();
                    setLocalError('');
                  }}
                >
                  {isAr ? 'تسجيل الدخول ←' : 'Sign in here →'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
