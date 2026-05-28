import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Trash2 } from 'lucide-react';
import './AIChatBot.css';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `You are Alpha AI, a helpful assistant for the Alpha Product Management Dashboard. You help users understand dashboard features and answer questions about:

1. **Navigation**: Dashboard has 4 main pages — Dashboard (home/overview), Products (browse/filter/search inventory), Analytics (admin-only charts & stats), and Settings (profile/theme/access).
2. **Products Page**: Features include debounced real-time search, multi-category filters, rating/stock filters, sort controls, table & grid views, column customizer, pagination, and live polling updates every 30s.
3. **Analytics Page**: Admin-only. Shows stat cards (total products, avg rating, inventory value, out of stock), bar charts (category distribution, rating distribution, price ranges), and horizontal bar chart (top inventory value by category).
4. **Authentication & RBAC**: Two demo accounts — Admin (admin@alpha.io / admin123) sees everything including Analytics and hidden products. User (user@alpha.io / user123) only sees published products, no analytics.
5. **Theme System**: Light mode (Plausible-inspired, clean white/indigo), Dark mode (Linear-inspired, deep navy/violet), and System (auto-detect OS). Toggle in TopBar or Settings.
6. **Tech Stack**: React 19, Vite, React Router, Recharts, Lucide Icons, CSS custom properties (no Tailwind). Data from DummyJSON API.
7. **URL State Sync**: Search, filters, sort, and pagination are all synced to URL parameters so users can share/bookmark filtered views.

Keep responses concise, friendly, and helpful. Use emoji sparingly. If asked about features that don't exist, suggest they could be added. Always refer to the dashboard as "Alpha".`;

// Read the key baked in at build time (from .env VITE_GROQ_API_KEY)
const ENV_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hey! I\'m Alpha AI 👋 Ask me anything about the dashboard — features, navigation, filters, analytics, or how things work!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  // Priority: localStorage override → env variable
  const [apiKey, setApiKey] = useState(() => {
    const stored = localStorage.getItem('groq-api-key');
    if (stored) return stored;
    if (ENV_KEY) {
      localStorage.setItem('groq-api-key', ENV_KEY); // persist so UI reflects it
      return ENV_KEY;
    }
    return '';
  });
  const [showKeyInput, setShowKeyInput] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Keyboard shortcut: Ctrl+K to toggle
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(o => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const saveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('groq-api-key', key);
    setShowKeyInput(false);
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    if (!apiKey) {
      setShowKeyInput(true);
      return;
    }

    const userMsg = { role: 'user', content: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.filter(m => m.role !== 'system').slice(-10),
            userMsg,
          ],
          max_tokens: 512,
          temperature: 0.7,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `API error ${res.status}`);
      }

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || 'Sorry, I couldn\'t generate a response.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ Error: ${err.message}. Please check your API key in settings.`
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      { role: 'assistant', content: 'Chat cleared! How can I help you?' }
    ]);
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        className={`chat-fab ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(o => !o)}
        aria-label="Toggle AI chat"
      >
        {isOpen ? <X size={22} /> : <Sparkles size={22} />}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="chat-panel animate-scale-in">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-header-icon">
                <Bot size={18} />
              </div>
              <div>
                <div className="chat-header-title">Alpha AI</div>
                <div className="chat-header-sub">Dashboard assistant</div>
              </div>
            </div>
            <div className="chat-header-actions">
              <button className="btn-icon" onClick={() => setShowKeyInput(s => !s)} aria-label="API settings" data-tooltip="API Key" data-tooltip-position="bottom">
                ⚙️
              </button>
              <button className="btn-icon" onClick={clearChat} aria-label="Clear chat" data-tooltip="Clear" data-tooltip-position="bottom">
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* API Key input */}
          {showKeyInput && (
            <div className="chat-key-section">
              <p className="chat-key-label">Enter your Groq API key:</p>
              <div className="chat-key-row">
                <input
                  type="password"
                  className="input chat-key-input"
                  placeholder="gsk_..."
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveApiKey(apiKey)}
                />
                <button className="btn btn-primary btn-sm" onClick={() => saveApiKey(apiKey)}>
                  Save
                </button>
              </div>
              <p className="chat-key-hint">Free key from <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer">console.groq.com</a></p>
            </div>
          )}

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role}`}>
                <div className="chat-msg-avatar">
                  {msg.role === 'assistant' ? <Bot size={14} /> : <User size={14} />}
                </div>
                <div className="chat-msg-content">
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-msg assistant">
                <div className="chat-msg-avatar"><Bot size={14} /></div>
                <div className="chat-msg-content typing">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chat-input-area">
            <input
              ref={inputRef}
              type="text"
              className="input chat-input"
              placeholder="Ask about the dashboard..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              className="chat-send-btn"
              onClick={handleSend}
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>

          <div className="chat-footer">
            <kbd>Ctrl</kbd>+<kbd>K</kbd> to toggle • Powered by Groq
          </div>
        </div>
      )}
    </>
  );
}
