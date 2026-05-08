# AlgoBrainOS — Complete Setup Guide

## FOLDER STRUCTURE (create this exactly)

```
AlgoBrainOS/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── models/
│   │   └── Problem.js
│   ├── middleware/
│   │   └── aiService.js
│   └── routes/
│       ├── problems.js
│       ├── dashboard.js
│       └── recommendations.js
└── SETUP.md
```

---

## STEP 1 — Install Prerequisites

### Node.js
- Go to https://nodejs.org
- Download the LTS version
- Install it (just click Next, Next, Finish)
- Verify: open Terminal/CMD → type: node --version

### MongoDB Community Server
- Go to https://www.mongodb.com/try/download/community
- Download and install for your OS
- During install, check "Install MongoDB as a Service" (Windows)
- MongoDB will run automatically in background

### VS Code (if not installed)
- https://code.visualstudio.com

---

## STEP 2 — Get Anthropic API Key

1. Go to https://console.anthropic.com
2. Sign up / Log in
3. Go to "API Keys" → Create a new key
4. Copy the key (starts with sk-ant-...)
5. Open backend/.env file
6. Replace: your_anthropic_api_key_here
   With your actual key

---

## STEP 3 — Open Project in VS Code

1. Open VS Code
2. File → Open Folder → Select the AlgoBrainOS folder
3. Open the integrated terminal: View → Terminal (or Ctrl + `)

---

## STEP 4 — Install Backend Dependencies

In the VS Code terminal, run these commands ONE BY ONE:

```
cd backend
npm install
```

Wait for it to finish. You'll see a node_modules folder appear.

---

## STEP 5 — Start MongoDB

### Windows:
MongoDB should already be running as a service.
To verify: Press Win+R → type services.msc → look for "MongoDB" → should say "Running"

If not running:
```
net start MongoDB
```

### Mac:
```
brew services start mongodb/brew/mongodb-community
```

### Linux (Ubuntu):
```
sudo systemctl start mongod
```

---

## STEP 6 — Start the Backend Server

In VS Code terminal (make sure you're inside the backend folder):

```
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on http://localhost:5000
```

If you see this, your backend is working!

---

## STEP 7 — Open the Frontend

Open a NEW terminal tab in VS Code (click the + icon in the terminal).

Option A — Simple (just open the file):
- Go to frontend/ folder in VS Code file explorer
- Right-click index.html → "Open with Live Server"
  (Install Live Server extension if you don't have it: Extensions → search "Live Server" → Install)

Option B — Manual:
- Just double-click the index.html file in your file explorer
- It will open in your browser

The app will be at: http://127.0.0.1:5500/frontend/index.html
(or http://localhost:5500 if using Live Server)

---

## STEP 8 — Test It Works

1. Click "Log Problem" in the sidebar
2. Fill in:
   - Problem Name: Two Sum
   - Approach: Used a hash map to store seen numbers
   - Mistakes: Initially tried brute force O(n²)
3. Click "Analyze & Log Problem"
4. Wait 3-5 seconds for AI analysis
5. You should see the AI result panel appear with topics, pattern, and insights!

---

## TROUBLESHOOTING

### "Cannot connect to server" in browser console:
→ Make sure `npm run dev` is running in the backend folder
→ Check the terminal shows "MongoDB Connected"

### "MongoDB connection failed":
→ MongoDB service is not running → follow Step 5 again

### "AI analysis unavailable":
→ Your ANTHROPIC_API_KEY in .env is wrong or missing
→ Double check you pasted the key correctly with no spaces

### Port already in use:
→ Change PORT=5001 in .env
→ Also update API constant in frontend/app.js: change 5000 to 5001

### CORS error in browser:
→ This is fixed already in the code. If it still happens, make sure you're opening
   the frontend via Live Server, not as a file:// URL.

---

## RUNNING THE PROJECT (Every Time)

Just do these two things:

1. Start backend:
```
cd backend
npm run dev
```

2. Open frontend/index.html in browser (or via Live Server)

That's it!

---

## API ENDPOINTS (for reference)

| Method | Endpoint | What it does |
|--------|----------|--------------|
| POST | /api/problems | Log new problem |
| GET | /api/problems | Get all problems |
| GET | /api/problems/:id | Get one problem |
| DELETE | /api/problems/:id | Delete a problem |
| GET | /api/dashboard | Get all stats |
| GET | /api/recommendations | Get AI recommendations |
