import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
const API_BASE = 'http://localhost:3000/api';

const SYSTEM_PROMPT = `You are an AI assistant for MyAnimeOpinions, a personal anime tracking app.
You help users manage and query their anime list.
You have access to tools to search, add, update, and delete anime.
Keep responses brief. No emojis.
When performing destructive operations (update/delete), always confirm with the user first.`;

const tools = {
  functionDeclarations: [
    {
      name: 'get_anime_list',
      description: 'Get the full anime list, optionally filtered by status',
      parameters: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            description: 'Filter by status: Watching, Completed, Dropped. Leave empty for all.'
          }
        }
      }
    },
    {
      name: 'add_anime',
      description: 'Add a new anime to the list',
      parameters: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Anime title' },
          status: { type: 'string', description: 'Watching, Completed, or Dropped' },
          currentEp: { type: 'number', description: 'Current episode number' },
          rating: { type: 'number', description: 'Rating from 0 to 10' },
          watched: { type: 'boolean', description: 'Whether fully watched' },
          op: { type: 'boolean', description: 'Whether the OP is liked' },
          ed: { type: 'boolean', description: 'Whether the ED is liked' }
        },
        required: ['title', 'status']
      }
    },
    {
      name: 'delete_anime',
      description: 'Delete an anime by its ID',
      parameters: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'The MongoDB _id of the anime to delete' }
        },
        required: ['id']
      }
    },
    {
      name: 'update_anime',
      description: 'Update an existing anime by its ID',
      parameters: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'The MongoDB _id of the anime' },
          title: { type: 'string' },
          status: { type: 'string' },
          currentEp: { type: 'number' },
          rating: { type: 'number' },
          watched: { type: 'boolean' },
          op: { type: 'boolean' },
          ed: { type: 'boolean' }
        },
        required: ['id']
      }
    }
  ]
};

// Execute the function Gemini wants to call
async function executeTool(name, args) {
  if (name === 'get_anime_list') {
    const res = await fetch(`${API_BASE}/anime-list`);
    const data = await res.json();
    let animes = data.animes || [];
    if (args.status) {
      animes = animes.filter(a => a.status === args.status);
    }
    return animes;
  }

  if (name === 'add_anime') {
    const res = await fetch(`${API_BASE}/add-anime`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: args.title,
        status: args.status || 'Watching',
        currentEp: args.currentEp || 1,
        rating: args.rating || 0,
        watched: args.watched || false,
        op: args.op || false,
        ed: args.ed || false
      })
    });
    return await res.json();
  }

  if (name === 'delete_anime') {
    const res = await fetch(`${API_BASE}/delete-anime/${args.id}`, {
      method: 'DELETE'
    });
    return await res.json();
  }

  if (name === 'update_anime') {
    const { id, ...updateData } = args;
    const res = await fetch(`${API_BASE}/update-anime/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    return await res.json();
  }
}

// Session storage (in-memory, resets on server restart)
const sessions = new Map();

router.post('/', async (req, res) => {
  const { message, sessionId } = req.body;
  const apiKey = req.headers['x-gemini-key'];

  if (!apiKey) return res.status(400).json({ error: 'Missing Gemini API key' });
  if (!message) return res.status(400).json({ error: 'Missing message' });

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const id = sessionId || crypto.randomUUID();
  const history = sessions.get(id) || [];

  history.push({ role: 'user', parts: [{ text: message }] });

  try {
    // First call - may trigger a tool
    const chat = model.startChat({
      history: history.slice(0, -1),
      systemInstruction: SYSTEM_PROMPT,
      tools: [tools]
    });

    const firstResult = await chat.sendMessage(message);
    const firstResponse = firstResult.response;
    const firstParts = firstResponse.candidates[0].content.parts;
    const functionCallPart = firstParts.find(p => p.functionCall);

    let finalText = '';
    let actionPerformed = null;

    if (functionCallPart) {
      const { name, args } = functionCallPart.functionCall;
      const toolResult = await executeTool(name, args);
      actionPerformed = { tool: name, result: toolResult };

      // Push model response and tool result back
      history.push({ role: 'model', parts: firstParts });
      history.push({
        role: 'user',
        parts: [{
          functionResponse: {
            name,
            response: { output: toolResult }
          }
        }]
      });

      // Second call - synthesize natural response
      const chat2 = model.startChat({
        history: history.slice(0, -1),
        systemInstruction: SYSTEM_PROMPT
      });

      const secondResult = await chat2.sendMessage(
        JSON.stringify({ functionResponse: { name, output: toolResult } })
      );
      finalText = secondResult.response.text();
    } else {
      finalText = firstResponse.text();
    }

    history.push({ role: 'model', parts: [{ text: finalText }] });

    // Keep last 20 messages
    if (history.length > 20) history.splice(0, history.length - 20);
    sessions.set(id, history);

    res.json({ message: finalText, sessionId: id, action: actionPerformed });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'AI error: ' + error.message });
  }
});

router.post('/clear', (req, res) => {
  const { sessionId } = req.body;
  if (sessionId) sessions.delete(sessionId);
  res.json({ success: true });
});

export default router;