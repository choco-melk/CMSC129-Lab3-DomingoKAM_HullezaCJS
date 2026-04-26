# About `my-anime-opinions`

## Creator

- Keith Ashly Domingo (TheAshly/FakeThird)
- Christian Jave Hulleza (choco-melk)

## Description

**`my-seasonal-anime-list`** is a incremental pair project made for CMSC 129: Software Engineering 2 laboratory, It is a full-stack anime tracking web application built with the MERN stack, enhanced with an AI-powered chatbot assistant using the Google Gemini API. The project is using [Jikan API](https://jikan.moe/) through their public API for getting anime datas.
```
https://api.jikan.moe/v4
```
---

## AI Features

### Inquiry Chatbot
Ask natural language questions about your anime list:
- "What anime am I currently watching?"
- "Show me my completed anime"
- "What's my highest rated anime?"
- "How many anime have I dropped?"
- "Do I have any anime with a rating above 8?"

### AI Assistant (CRUD via Natural Language)
Perform full CRUD operations through conversation:
- **Add:** "Add Demon Slayer to my list as Watching"
- **Update:** "Update Frieren to Completed and mark it as watched"
- **Delete:** "Delete Steel Ball Run from my list"
- **Context-aware:** "Scratch that, update it to Dropped instead"

### Key Behaviors
- Asks for confirmation before update/delete operations
- Understands partial titles ("frieren" matches "Sousou no Frieren")
- Maintains conversation context across messages (up to 20 messages)
- Refuses out-of-scope requests (code, math, general knowledge, etc.)
- Main page refreshes automatically after any write operation

---

## AI Service Used

**Google Gemini API** — `gemini-2.0-flash` model  
Uses Gemini's function calling feature for a two-step process:
1. First call — Gemini decides which tool to use based on user message
2. Second call — Gemini synthesizes a natural language response from the tool result

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | MongoDB (Replica Set) |
| AI | Google Gemini API |
| ODM | Mongoose |

---

## Project Structure
```
my-seasonal-anime-list/
├── client/                         # React frontend
│   └── src/
│       ├── components/
│       │   ├── AnimeBot.jsx        # Floating AI chat widget
│       │   ├── AnimeList.jsx       # Anime table with inline editing
│       │   ├── SearchAnime.jsx     # Search Anime through API
│       │   ├── AddAnimeModal.jsx   
│       │   └── DeleteAnimeModal.jsx 
│       ├── pages/
│       │   └── HomeScreen.jsx      # Main page
│       ├── services/
│       │   └── ChatService.js      # Frontend API calls to chat backend
│       ├── App.jsx                 # Returns the whole front end to main
│       └── main.jsx                # Main file that runs
├── server/                         # Express backend
│   ├── routes/
│   │   ├── MALChatter.js           # AI chat route (Gemini integration)
│   │   ├── AddUserAnimeRoute.js
│   │   ├── UpdateUserAnimeRoute.js
│   │   ├── DeleteUserAnimeRoute.js
│   │   ├── FetchUserAnimesRoute.js
│   │   └── BackupRoute.js          # Backup Database route
│   ├── controllers/                # Route handlers
│   ├── models/
│   │   └── UserAnimeModel.js       # Mongoose schema
│   ├── config/
│   │   └── database.js             # MongoDB connection
│   ├── .env                        # env variables
│   └── server.js                   # Express entry point
└── README.md
```
---

## Environment Variables

### `server/.env`
```env
MONGODB_URI=your-mongodb-connection-string
BACKUP_MONGODB_URI=your-mongodb-connection-string
VITE_GEMINI_API_KEY=your-gemini-api-key
```

See `.env.example` files in `server/` for reference.

---

## Getting a Gemini API Key

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign in with your Google account
3. Click **Get API Key** → **Create API Key**
4. Copy the key and paste it into `server/.env` as `VITE_GEMINI_API_KEY`

> **Note:** The free tier provides sufficient quota for development and testing. If you hit rate limits, generate a new key or switch to `gemini-1.5-flash` in `MALChatter.js` as each model has its own separate quota pool.

---

## Setup Instructions

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/CMSC129-Lab3-DomingoKAM_HullezaCJS.git
cd CMSC129-Lab3-DomingoKAM_HullezaCJS
```

2. **Install server dependencies**
```bash
cd server
npm install
```

3. **Install client dependencies**
```bash
cd ../client
npm install
```

4. **Set up environment variables**
```bash
# in server/
cp .env.example .env
# fill in MONGODB_URI, BACKUP_MONGODB_URI, and VITE_GEMINI_API_KEY
```

5. **Start the server**
```bash
cd server
node server.js
```

6. **Start the client**
```bash
cd client
npm run dev
```

7. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## API Endpoints

### Anime CRUD
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/anime-list` | Fetch all anime |
| POST | `/api/add-anime` | Add new anime |
| PATCH | `/api/update-anime/:id` | Update anime |
| DELETE | `/api/delete-anime/:id` | Delete anime |

### AI Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Send message to AI |
| POST | `/api/chat/clear` | Clear session history |

---

## How the AI Works
```
User types message
│
▼
ChatService.js → POST /api/chat
│
▼
MALChatter.js receives message
│
▼
Gemini (1st call) — decides if tool needed
│
┌──┴──┐
│     │
Tool   No tool
call    │
│    └→ Return text response directly
▼
executeTool() → calls existing /api routes
│
▼
Gemini (2nd call) — synthesizes natural response
│
▼
Response sent back to frontend
│
▼
If write operation → fetchAnimeList() refreshes table
```

---

## Security

- Gemini API key is stored in `server/.env` and never sent to the frontend
- All AI requests are proxied through the Express backend
- The AI never has direct database access — it only calls existing API routes
- Input is validated on both frontend and backend

---

## Example Chatbot Interactions

**Inquiry:**
> User: "What anime am I watching?"  
> Bot: "You currently have 3 anime with Watching status: Steins;Gate (ep 12), Hunter x Hunter (ep 50), and Kaguya-sama: Love Is War (ep 1)."

**Add:**
> User: "Add Vinland Saga to my list"  
> Bot: "What status should I set for Vinland Saga — Watching, Completed, or Dropped?"  
> User: "Watching"  
> Bot: "Done! I've added Vinland Saga to your list as Watching."

**Update with confirmation:**
> User: "Update Frieren to completed"  
> Bot: "Just to confirm — update Sousou no Frieren to Completed status?"  
> User: "Yes"  
> Bot: "Done! I've updated Sousou no Frieren — status changed to Completed."

**Out of scope:**
> User: "Write me a Python loop"  
> Bot: "Sorry, I can only help you manage your anime list. I can't help with that!"

## License and Credits

This project was created as a pair incremental project for CMSC 129 - Software Engineering 2.

- Credits to MyAnimeList (MAL) for the design and the project is only meant to reference it.
- Code is free for **educational purposes** (learning, teaching, academic research)
- Code is free for **personal, non-commercial use**

**Copyright © 2026 Keith Ashly Domingo and Christian Jave Hulleza**