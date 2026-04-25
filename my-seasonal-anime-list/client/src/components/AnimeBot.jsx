import { useState, useRef, useEffect } from 'react';
import { sendMessage, clearChat } from './services/ChatService';
// import './AnimeBot.css';

const QUICK_PROMPTS = [
  "What anime am I watching?",
  "Show my completed anime",
  "What's my highest rated anime?",
  "How many anime have I dropped?"
];

function AnimeBot({ onListUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I can help you manage your anime list. Ask me anything!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (role, content, extra = {}) => {
    setMessages(prev => [...prev, { role, content, ...extra }]);
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

      // If a write operation was performed, refresh the anime list
      if (action && ['add_anime', 'update_anime', 'delete_anime'].includes(action.tool)) {
        if (onListUpdate) onListUpdate();
      }
    } catch {
      addMessage('assistant', "Sorry, something went wrong. Please try again.");
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
          <div className="animebot-header">
            <span>Anime Assistant</span>
            <div>
              <button onClick={handleClear} title="Clear chat">🧹</button>
              <button onClick={() => setIsOpen(false)}>✕</button>
            </div>
          </div>

          <div className="animebot-messages">
            {messages.length === 1 && (
              <div className="animebot-quick-prompts">
                {QUICK_PROMPTS.map((p, i) => (
                  <button key={i} onClick={() => handleSend(p)} disabled={isLoading}>{p}</button>
                ))}
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`animebot-message ${msg.role}`}>
                <div className="animebot-bubble">{msg.content}</div>
              </div>
            ))}
            {isLoading && (
              <div className="animebot-message assistant">
                <div className="animebot-bubble">...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="animebot-input-area">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything about your list..."
              disabled={isLoading}
            />
            <button onClick={() => handleSend()} disabled={!input.trim() || isLoading}>Send</button>
          </div>
        </div>
      )}
      <button className="animebot-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
}

export default AnimeBot;