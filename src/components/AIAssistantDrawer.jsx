import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, BookOpen, BookmarkCheck, Bot, ShieldCheck } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import StatusBadge from './StatusBadge';

export default function AIAssistantDrawer() {
  const {
    isAIDrawerOpen,
    closeAIDrawer,
    aiMessages,
    isAILoading,
    sendAIMessage,
    openBookModal,
    reserveBook,
    lang
  } = useLibrary();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAIDrawerOpen) {
      scrollToBottom();
    }
  }, [aiMessages, isAIDrawerOpen, isAILoading]);

  if (!isAIDrawerOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isAILoading) return;
    sendAIMessage(input);
    setInput('');
  };

  const handleSuggestionClick = (suggestion) => {
    sendAIMessage(suggestion);
  };

  const isRTL = lang === 'ar';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(3px)',
        zIndex: 998,
        display: 'flex',
        justifyContent: isRTL ? 'flex-start' : 'flex-end',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={closeAIDrawer}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          height: '100%',
          backgroundColor: 'var(--bg-surface)',
          borderLeft: isRTL ? 'none' : '1px solid var(--border-subtle)',
          borderRight: isRTL ? '1px solid var(--border-subtle)' : 'none',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          animation: isRTL ? 'slideDrawerInRTL 0.3s cubic-bezier(0.16, 1, 0.3, 1)' : 'slideDrawerInLTR 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--color-ai-surface)',
            borderTop: '3px solid var(--color-ai-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-ai-accent)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-ai-accent)', margin: 0 }}>
                  أمين المكتبة الذكي
                </h3>
                <span
                  style={{
                    fontSize: '0.7rem',
                    backgroundColor: 'rgba(180, 83, 9, 0.15)',
                    color: 'var(--color-ai-accent)',
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 700
                  }}
                >
                  AI Assistant
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                اكتشاف عناوين الفهرس وشرح السياسات المعتمدة
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-icon"
            onClick={closeAIDrawer}
            aria-label="إغلاق الدرج"
          >
            <X size={18} />
          </button>
        </div>

        {/* Security & Disclaimer Notice */}
        <div
          style={{
            padding: '8px 16px',
            backgroundColor: 'var(--bg-muted)',
            borderBottom: '1px solid var(--border-subtle)',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <ShieldCheck size={14} color="var(--color-ai-accent)" />
          <span>المساعد للاسترشاد والتوصية؛ العمليات الفعلية كالإعارة تدار عبر النظام.</span>
        </div>

        {/* Messages Stream */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          {aiMessages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isUser ? 'flex-end' : 'flex-start',
                  gap: '6px'
                }}
              >
                <div
                  style={{
                    maxWidth: '90%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: '0.88rem',
                    lineHeight: 1.5,
                    backgroundColor: isUser ? 'var(--color-primary)' : 'var(--bg-muted)',
                    color: isUser ? '#FFFFFF' : 'var(--text-primary)',
                    border: isUser ? 'none' : '1px solid var(--border-subtle)',
                    borderBottomRightRadius: isUser && isRTL ? 'var(--radius-xs)' : 'var(--radius-lg)',
                    borderBottomLeftRadius: isUser && !isRTL ? 'var(--radius-xs)' : 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-xs)'
                  }}
                >
                  {!isUser && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px', color: 'var(--color-ai-accent)', fontWeight: 700, fontSize: '0.78rem' }}>
                      <Bot size={14} />
                      <span>توصية الفهرس الذكي:</span>
                    </div>
                  )}
                  <div>{msg.text}</div>
                </div>

                {/* If assistant returned matched books */}
                {!isUser && msg.matchedBooks && msg.matchedBooks.length > 0 && (
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                    {msg.matchedBooks.map((book) => (
                      <div
                        key={book.id}
                        className="card"
                        style={{
                          padding: '10px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          backgroundColor: 'var(--bg-surface)',
                          border: '1px solid var(--border-subtle)'
                        }}
                      >
                        <img
                          src={book.cover_image}
                          alt={book.title}
                          style={{
                            width: '45px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: 'var(--radius-sm)'
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4
                            style={{
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              margin: '0 0 2px 0',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              color: 'var(--text-primary)'
                            }}
                          >
                            {book.title}
                          </h4>
                          <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: '0 0 4px 0' }}>
                            {book.author}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <StatusBadge
                              status={book.available_copies > 0 ? 'available' : 'borrowed'}
                              text={`${book.available_copies} متاح`}
                              size="sm"
                            />
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              {book.shelf_location}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.74rem' }}
                            onClick={() => {
                              openBookModal(book);
                              closeAIDrawer();
                            }}
                          >
                            <BookOpen size={12} />
                            <span>عرض</span>
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.74rem' }}
                            onClick={() => reserveBook(book.id)}
                          >
                            <BookmarkCheck size={12} />
                            <span>حجز</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggestions chips */}
                {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                    {msg.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        style={{
                          backgroundColor: 'var(--color-ai-surface)',
                          color: 'var(--color-ai-accent)',
                          border: '1px solid var(--color-ai-border)',
                          borderRadius: 'var(--radius-full)',
                          padding: '4px 10px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)',
                          textAlign: 'start'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-muted)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-ai-surface)')}
                      >
                        ⚡ {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {isAILoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: 'var(--color-ai-surface)', borderRadius: 'var(--radius-lg)', color: 'var(--color-ai-accent)', fontSize: '0.85rem' }}>
              <Sparkles size={16} className="pulse-amber" />
              <span>جاري استرجاع الكتب من الفهرس وصياغة الشرح...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: '14px 16px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface)',
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
          }}
        >
          <input
            type="text"
            className="form-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اسأل عن عنوان، فكرة، أو سياسة الإعارة..."
            style={{ flex: 1 }}
            disabled={isAILoading}
          />
          <button
            type="submit"
            className="btn btn-ai"
            style={{ width: '42px', height: '42px', padding: 0 }}
            disabled={!input.trim() || isAILoading}
            aria-label="إرسال السؤال"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
