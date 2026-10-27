import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Sparkles, Clock, MapPin, Mail, Phone,
  ArrowUp, Shield, CheckCircle2, Heart
} from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';

export default function Footer() {
  const { lang, openAIDrawer } = useLibrary();
  const isAr = lang === 'ar';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="public-footer">
      {/* Top feature highlights bar */}
      <div className="footer-highlights">
        <div className="footer-highlights-container">
          <div className="footer-highlight-item">
            <div className="footer-highlight-icon">
              <Sparkles size={20} />
            </div>
            <div className="footer-highlight-text">
              <strong>{isAr ? 'استكشاف ذكي مدعوم بالذكاء الاصطناعي' : 'AI-Powered Semantic Discovery'}</strong>
              <span>{isAr ? 'توصيات دلالية متقدمة تفهم استفساراتك المعرفية' : 'Context-aware recommendations that understand your queries'}</span>
            </div>
          </div>

          <div className="footer-highlight-item">
            <div className="footer-highlight-icon">
              <BookOpen size={20} />
            </div>
            <div className="footer-highlight-text">
              <strong>{isAr ? 'فهرسة دقيقة وتتبع فوري للنسخ' : 'Real-Time Catalog & Barcode Tracking'}</strong>
              <span>{isAr ? 'معرفة مواقع الأرفف وتوافر النسخ المطبوعة لحظياً' : 'Instant shelf locations and multi-copy availability status'}</span>
            </div>
          </div>

          <div className="footer-highlight-item">
            <div className="footer-highlight-icon">
              <Shield size={20} />
            </div>
            <div className="footer-highlight-text">
              <strong>{isAr ? 'سياسات إعارة عادلة ومنظمة' : 'Fair Lending & Queue Policies'}</strong>
              <span>{isAr ? 'إدارة دور الحجز والتجديد وفق لوائح واضحة' : 'Transparent hold queues, renewal rules, and grace periods'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer body */}
      <div className="footer-main">
        <div className="footer-main-container">
          {/* Brand & description */}
          <div className="footer-col footer-col-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <BookOpen size={22} />
              </div>
              <div className="footer-logo-text">
                <span className="footer-logo-title">{isAr ? 'المكتبة الذكية' : 'Smart Library'}</span>
                <span className="footer-logo-badge">LMS 2026</span>
              </div>
            </div>

            <p className="footer-brand-desc">
              {isAr
                ? 'المنصة الرقمية المتكاملة لإدارة الفهارس وحركة الإعارة والاستكشاف المعرفي، مصممة بأحدث معايير تجربة المستخدم لخدمة الباحثين والقراء والموظفين.'
                : 'The unified digital platform for catalog management, circulation workflows, and knowledge discovery, engineered with modern UX standards.'}
            </p>

            <div className="footer-status-pill">
              <span className="footer-status-dot" />
              <span>{isAr ? 'النظام متصل • الفهرس محدّث' : 'System Online • Catalog Live'}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">{isAr ? 'الفهرس والاستكشاف' : 'Catalog & Discovery'}</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">{isAr ? 'تصفح جميع العناوين' : 'Browse All Titles'}</Link>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => openAIDrawer(isAr ? 'أفضل مراجع الذكاء الاصطناعي وهندسة البرمجيات' : 'Top AI & software engineering references')}
                >
                  <Sparkles size={13} style={{ color: 'var(--color-ai-accent)' }} />
                  <span>{isAr ? 'مراجع الذكاء الاصطناعي' : 'AI & Tech References'}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => openAIDrawer(isAr ? 'روايات تاريخية عربية مشوقة' : 'Compelling historical literature')}
                >
                  <span>{isAr ? 'الأدب والتاريخ' : 'Literature & History'}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => openAIDrawer(isAr ? 'قصة غموض قصيرة للمبتدئين' : 'Short mystery stories for beginners')}
                >
                  <span>{isAr ? 'الغموض والتشويق' : 'Mystery & Fiction'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Member Services */}
          <div className="footer-col">
            <h4 className="footer-col-title">{isAr ? 'خدمات المستفيدين' : 'Member Services'}</h4>
            <ul className="footer-links">
              <li>
                <Link to="/my-loans">{isAr ? 'إعاراتي وحجوزاتي' : 'My Loans & Reservations'}</Link>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => openAIDrawer(isAr ? 'ما هي مدة الإعارة وسياسة التجديد؟' : 'What is the loan duration and renewal policy?')}
                >
                  <span>{isAr ? 'سياسة الإعارة والتجديد' : 'Lending & Renewal Rules'}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => openAIDrawer()}
                >
                  <Sparkles size={13} style={{ color: 'var(--color-ai-accent)' }} />
                  <span>{isAr ? 'المساعد الذكي للمكتبة' : 'AI Assistant Drawer'}</span>
                </button>
              </li>
              <li>
                <Link to="/login">{isAr ? 'تسجيل دخول الأعضاء والموظفين' : 'Member & Staff Sign In'}</Link>
              </li>
            </ul>
          </div>

          {/* Working hours & Contact */}
          <div className="footer-col">
            <h4 className="footer-col-title">{isAr ? 'أوقات العمل والتواصل' : 'Hours & Contact'}</h4>
            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <Clock size={16} className="footer-contact-icon" />
                <div className="footer-contact-details">
                  <span className="footer-contact-label">{isAr ? 'الأحد – الخميس:' : 'Sun – Thu:'}</span>
                  <span className="footer-contact-value">8:00 AM – 9:00 PM</span>
                </div>
              </div>

              <div className="footer-contact-item">
                <Clock size={16} className="footer-contact-icon" />
                <div className="footer-contact-details">
                  <span className="footer-contact-label">{isAr ? 'الجمعة – السبت:' : 'Fri – Sat:'}</span>
                  <span className="footer-contact-value">2:00 PM – 9:00 PM</span>
                </div>
              </div>

              <div className="footer-contact-item">
                <MapPin size={16} className="footer-contact-icon" />
                <div className="footer-contact-details">
                  <span className="footer-contact-label">{isAr ? 'الموقع:' : 'Location:'}</span>
                  <span className="footer-contact-value">{isAr ? 'مبنى المعرفة، قاعة الفهرسة الرئيسية' : 'Knowledge Hall, Main Circulation Desk'}</span>
                </div>
              </div>

              <div className="footer-contact-item">
                <Mail size={16} className="footer-contact-icon" />
                <div className="footer-contact-details">
                  <span className="footer-contact-label">{isAr ? 'الدعم:' : 'Email:'}</span>
                  <span className="footer-contact-value" dir="ltr">info@smartlibrary.sa</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom copyright row */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <span className="footer-copyright">
            {isAr
              ? '© 2026 نظام إدارة المكتبة الذكي (Smart Library LMS). جميع الحقوق محفوظة.'
              : '© 2026 Smart Library LMS. All rights reserved.'}
          </span>

          <div className="footer-bottom-links">
            <span className="footer-bottom-link">{isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}</span>
            <span className="footer-bottom-bullet">•</span>
            <span className="footer-bottom-link">{isAr ? 'شروط الخدمة' : 'Terms of Service'}</span>
            <span className="footer-bottom-bullet">•</span>
            <span className="footer-bottom-link">{isAr ? 'إمكانية الوصول' : 'Accessibility'}</span>
          </div>

          <button
            type="button"
            className="footer-back-to-top"
            onClick={scrollToTop}
            title={isAr ? 'العودة للأعلى' : 'Back to top'}
          >
            <span>{isAr ? 'للأعلى' : 'Top'}</span>
            <ArrowUp size={15} />
          </button>
        </div>
      </div>
    </footer>
  );
}
