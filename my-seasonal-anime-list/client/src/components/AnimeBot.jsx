import { useState, useRef, useEffect } from 'react';
import { sendMessage, clearChat } from '../services/ChatService';
import './AnimeBot.css';

// ─── MASCOT CONFIG ───────────────────────────────────────────────
// Drop your mascot image into your assets folder and update this path.
// Set to null to use the fallback emoji/initial avatar instead.
const MASCOT_IMAGE = "./assets/squid_girl.png"; 
// ─────────────────────────────────────────────────────────────────

const QUICK_PROMPTS = [
  "What anime am I watching?",
  "Show my completed anime",
  "What's my highest rated anime?",
  "How many anime have I dropped?"
];

// Small avatar shown next to each assistant message bubble
function AssistantAvatar() {
  if (MASCOT_IMAGE) {
    return <img src={MASCOT_IMAGE} alt="bot" className="animebot-msg-avatar" />;
  }
  return <div className="animebot-msg-avatar-fallback">🌸</div>;
}

function AnimeBot({ onListUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Yahhoo~! ✨ I'm your anime bestie here to help with MyAnimeOpinions! (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ Whether you want to add, update, delete, or just peek at your list — I've got you, senpai! Waku waku! (≧◡≦)" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (role, content) => {
    setMessages(prev => [...prev, { role, content }]);
  };

  const handleSend = async (overrideMessage = null) => {
    const text = overrideMessage || input.trim();
    if (!text || isLoading) return;
    setInput('');
    addMessage('user', text);
    setIsLoading(true);

    try {
      const { message, action } = await sendMessage(text);
      addMessage('assistant', message);

      if (action && ['add_anime', 'update_anime', 'delete_anime'].includes(action.tool)) {
        if (onListUpdate) onListUpdate();
      }
    } catch (error) {
      // ✅ show the character error message from backend if available
      addMessage('assistant', error.message || "Uwaaah~! Something went wrong! (๑•́ ₃ •̀๑) Please try again!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = async () => {
    await clearChat();
    setMessages([{ role: 'assistant', content: "Chat cleared! How can I help?" }]);
  };

  return (
    <div className="animebot-widget">
      {isOpen && (
        <div className="animebot-panel">

          {/* ── Header ── */}
          <div className="animebot-header">
            <div className="animebot-header-left">
              {/* Mascot in header */}
              {MASCOT_IMAGE
                ? <img src={MASCOT_IMAGE} alt="mascot" className="animebot-header-mascot" />
                : <div className="animebot-header-avatar">🌸</div>
              }
              <div>
                <div className="animebot-header-title">Anime Assistant</div>
                <div className="animebot-header-subtitle">Ask about your list</div>
              </div>
            </div>

          <div className="animebot-header-actions">
              <button onClick={handleClear} title="Clear chat">🧹 Clear</button>
          </div>
          </div>

          {/* ── Messages ── */}
          <div className="animebot-messages">
            {messages.length === 1 && (
              <div className="animebot-quick-prompts">
                {QUICK_PROMPTS.map((p, i) => (
                  <button key={i} onClick={() => handleSend(p)} disabled={isLoading}>
                    {p}
                  </button>
                ))}
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`animebot-message ${msg.role}`}>
                {msg.role === 'assistant' && <AssistantAvatar />}
                <div className="animebot-bubble">{msg.content}</div>
              </div>
            ))}

            {isLoading && (
              <div className="animebot-message assistant">
                <AssistantAvatar />
                <div className="animebot-typing-dots">
                  <span /><span /><span />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Input ── */}
          <div className="animebot-input-area">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything about your list..."
              disabled={isLoading}
            />
            <button onClick={() => handleSend()} disabled={!input.trim() || isLoading}>
              Send
            </button>
          </div>
        </div>
      )}

      {/* ── Toggle Button (mascot or emoji) ── */}
      <button className="animebot-toggle" onClick={() => setIsOpen(!isOpen)} title="Anime Assistant">
        {isOpen
          ? <span className="animebot-toggle-emoji">✕</span>
          : MASCOT_IMAGE
            ? <img src={MASCOT_IMAGE} alt="Open chat" className="animebot-toggle-mascot" />
            : <span className="animebot-toggle-emoji">💬</span>
        }
      </button>
    </div>
  );
}

export default AnimeBot;