const API_BASE = 'http://localhost:3000/api';
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let sessionId = null;

export async function sendMessage(message) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-gemini-key': GEMINI_KEY
    },
    body: JSON.stringify({ message, sessionId })
  });
  const data = await res.json();
  sessionId = data.sessionId;
  return data;
}

export async function clearChat() {
  await fetch(`${API_BASE}/chat/clear`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId })
  });
  sessionId = null;
}