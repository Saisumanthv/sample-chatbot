# AI-Powered Simple Chatbot

A complete, production-ready full-stack conversational AI application built with **React.js (Vite)**, **Node.js (Express.js)**, **Supabase PostgreSQL & Auth**, and **Google Gemini AI** (using the official `@google/genai` SDK).

---

## 🏗️ Architecture & Features

- **Frontend (`client/`)**:
  - React 18 with Vite and React Router DOM v7
  - Tailwind CSS for modern responsive styling (desktop, tablet, mobile)
  - Supabase Authentication integration for signup, login, session persistence, and logout
  - Markdown rendering with code blocks and GitHub-flavored formatting (`react-markdown`, `remark-gfm`)
  - Copy response functionality with visual toast feedback
  - Suggested prompts for new conversations
  - Client-side search within user conversation history
  - Conversation rename and deletion dialogs with confirmation

- **Backend (`server/`)**:
  - Express.js with ES Modules
  - Official Google Gen AI SDK (`@google/genai`) for conversational response, title, and suggested prompt generation
  - Supabase Bearer token verification with user-scoped database access
  - Zod validation for all requests
  - HTTP security with Helmet, CORS, and Express Rate Limit
  - Conversation context management and safe fallbacks for titles & suggestions

- **Database (`database/`)**:
  - Supabase PostgreSQL with UUID primary keys
  - Tables: `profiles`, `conversations`, `messages`
  - Automated `updated_at` triggers
  - User profile creation trigger on signup
  - Conversation ownership integrity trigger ensuring `messages.user_id` matches `conversations.user_id`
  - Row Level Security (RLS) policies enforcing complete user isolation

---

## 🚀 Quick Start: Running Backend and Frontend

### Step 1: Install Dependencies

From the root project directory:

```bash
# Server dependencies
cd server
npm install
cd ..

# Client dependencies
cd client
npm install
cd ..
```

*(Note for Windows PowerShell users: if script execution is restricted, use `npm.cmd install`)*

---

### Step 2: Configure Environment Variables

1. **Server (`server/.env`)**:
   ```env
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173

   # Supabase Configuration
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

   # Google Gemini Configuration
   GEMINI_API_KEY=your-google-gemini-api-key
   GEMINI_MODEL=gemini-2.5-flash
   ```

2. **Client (`client/.env`)**:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. **Supabase Database Setup**:
   - In your Supabase Dashboard, open the **SQL Editor**.
   - Copy and execute [database/schema.sql](database/schema.sql).
   - Copy and execute [database/policies.sql](database/policies.sql).

---

### Step 3: Run Backend and Frontend Separately

#### Terminal 1 — Run Backend Server (Port 5000)
```bash
cd server
npm run dev
```
*(Runs with `--watch` for automatic restart on file changes. Health check available at `http://localhost:5000/api/health`)*

#### Terminal 2 — Run Frontend Client (Port 5173)
```bash
cd client
npm run dev
```
*(Runs Vite dev server. Open `http://localhost:5173` in your browser)*

---

### Or Run From Root Directory

From the project root:

- **Run Backend only**:
  ```bash
  npm run dev:server
  ```
- **Run Frontend only**:
  ```bash
  npm run dev:client
  ```
- **Run Both concurrently**:
  ```bash
  npm run dev
  ```

