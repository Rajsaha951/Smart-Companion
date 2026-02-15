# 🧠 Smart Companion

**AI-Powered Task Management & Emotional Support for Neurodivergent Individuals**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://python.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

---

## 📖 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Docker Deployment](#docker-deployment)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🎯 Overview

**Smart Companion** is a comprehensive web application specifically designed for individuals with ADHD, dyslexia, and executive function challenges. It combines AI-powered task decomposition with empathetic emotional support to help users overcome task paralysis and achieve their goals.

### The Problem We Solve

Many neurodivergent individuals struggle with:
- **Task Paralysis** - Feeling overwhelmed by large tasks
- **Executive Dysfunction** - Difficulty starting and organizing work
- **Time Blindness** - Inability to estimate task duration
- **Reading Difficulties** - Traditional interfaces are not accessible
- **Emotional Overwhelm** - Lack of judgment-free support

### Our Solution

Smart Companion provides:
- **AI Task Breakdown** - Converts overwhelming tasks into tiny, manageable micro-steps
- **Adaptive Learning** - Adjusts difficulty based on user behavior patterns
- **Empathetic AI Companion** - Non-judgmental emotional support and encouragement
- **Accessibility First** - Dark mode, dyslexia-friendly fonts, high contrast, large text
- **Privacy Focused** - Automatic PII sanitization before AI processing
- **Focus Mode** - Distraction-free environment for one-step-at-a-time execution

---

## ✨ Key Features

### 🎯 Task Planner
- **AI-Powered Decomposition** - Breaks tasks into micro-steps using Google Gemini
- **Adaptive Complexity** - Automatically adjusts step size based on user metrics
- **Progress Tracking** - Visual indicators and completion celebrations
- **PII Sanitization** - Removes personal information before AI processing
- **Session Management** - Tracks and saves task progress

### 💬 AI Companion
- **Empathetic Chat** - Non-judgmental, supportive conversation
- **State-Aware Responses** - Adapts based on user's emotional/cognitive state
- **Crisis Support** - Emergency calm space with breathing exercises
- **Chat History** - Export and save conversations
- **Voice Input** - Speak your thoughts instead of typing

### ♿ Accessibility Features
- **Dark Mode** - Full dark theme with proper contrast
- **Dyslexia-Friendly Font** - OpenDyslexic and Lexend fonts
- **Large Text Mode** - Scalable text sizes (up to 20px)
- **High Contrast Mode** - Enhanced visibility
- **Focus Mode Toggle** - Remove distractions instantly
- **Keyboard Navigation** - Full keyboard accessibility
- **Screen Reader Support** - ARIA labels throughout

### 🔒 Security & Privacy
- **JWT Authentication** - Secure token-based auth with 7-day expiration
- **Password Encryption** - bcrypt with 10 rounds
- **PII Sanitization** - Automatic removal of sensitive data
- **CORS Protection** - Whitelist-based origin control
- **Input Validation** - Express-validator on all endpoints
- **Secure Headers** - XSS and CSRF protection

### 📊 Progress Tracking
- **Micro-Wins Counter** - Celebrate every small achievement
- **Day Streaks** - Maintain momentum with streak tracking
- **Session Analytics** - Track completion rates and patterns
- **Achievement System** - Unlock badges for milestones
- **Energy Level Tracking** - Monitor daily energy patterns

### 🎨 User Experience
- **Beautiful UI** - Modern, calming design with warm colors
- **Smooth Animations** - Gentle transitions and feedback
- **Toast Notifications** - Non-intrusive success/error messages
- **Loading States** - Clear feedback during processing
- **Body Doubling** - Virtual co-working companion
- **Quick Templates** - Pre-filled common tasks

---

## 🛠️ Technology Stack

### Frontend
- **Vanilla JavaScript** - No framework overhead, fast loading
- **Modern CSS3** - Custom properties, animations, grid/flexbox
- **HTML5** - Semantic markup, accessibility
- **Web Speech API** - Voice input support
- **LocalStorage** - Client-side state persistence

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

### LLM API
- **Python 3.11+** - Programming language
- **FastAPI** - Modern Python web framework
- **Google Gemini** - LLM for AI features
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and static file serving
- **MongoDB** - Database with persistent volumes

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                          │
│                    (Vanilla JS + CSS)                           │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP/REST
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Backend API (Node.js)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │     Auth     │  │   Planner    │  │  Companion   │        │
│  │  Controller  │  │  Controller  │  │  Controller  │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│         │                  │                  │                 │
│         ↓                  ↓                  ↓                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │     JWT      │  │PII Sanitizer │  │  AI Proxy    │        │
│  │ Middleware   │  │  Middleware  │  │   Service    │        │
│  └──────────────┘  └──────────────┘  └──────┬───────┘        │
└──────────┬──────────────────────────────────┼─────────────────┘
           │                                   │
           ↓                                   ↓
┌──────────────────────┐          ┌──────────────────────────────┐
│   MongoDB Database   │          │   LLM API (FastAPI/Python)   │
│   ┌──────────────┐   │          │  ┌────────────────────────┐ │
│   │    Users     │   │          │  │   Task Decomposer      │ │
│   │   Profiles   │   │          │  │  (Adaptive Rules)      │ │
│   │   Sessions   │   │          │  ├────────────────────────┤ │
│   │   Metrics    │   │          │  │  Companion Responder   │ │
│   └──────────────┘   │          │  │   (State Inference)    │ │
└──────────────────────┘          │  └───────────┬────────────┘ │
                                   └──────────────┼──────────────┘
                                                  │
                                                  ↓
                                   ┌──────────────────────────────┐
                                   │   Google Gemini LLM API      │
                                   │   (External Service)         │
                                   └──────────────────────────────┘
```

### Request Flow: Task Decomposition

1. **User** enters overwhelming task in frontend
2. **Frontend** sends POST to `/api/planner/decompose`
3. **Backend** authenticates via JWT middleware
4. **Backend** sanitizes PII from task description
5. **Backend** retrieves user preferences and metrics from MongoDB
6. **Backend** forwards to LLM API at `/decompose`
7. **LLM API** applies adaptive rules based on user behavior
8. **LLM API** calls Google Gemini with specialized prompt
9. **Gemini** returns micro-steps in JSON format
10. **LLM API** validates and returns steps
11. **Backend** creates TaskSession in MongoDB
12. **Backend** returns steps to frontend
13. **Frontend** displays steps with progress tracking

### Request Flow: AI Companion

1. **User** sends message in chat
2. **Frontend** sends POST to `/api/companion/respond`
3. **Backend** authenticates and retrieves user profile
4. **Backend** forwards to LLM API at `/companion/respond`
5. **LLM API** infers user's volatile state from metrics
6. **LLM API** builds context-aware prompt
7. **LLM API** calls Google Gemini
8. **Gemini** returns empathetic response
9. **Backend** returns response to frontend
10. **Frontend** displays message with typing animation

---

## 📋 Prerequisites

### Required
- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **Python** 3.11 or higher ([Download](https://www.python.org/))
- **MongoDB** 7.0 or higher ([Download](https://www.mongodb.com/try/download/community))
- **Google Gemini API Key** ([Get Free Key](https://ai.google.dev/))

### Optional
- **Docker** & **Docker Compose** ([Download](https://docs.docker.com/get-docker/))
- **Git** ([Download](https://git-scm.com/))

### System Requirements
- **RAM:** 4GB minimum, 8GB recommended
- **Storage:** 500MB for application + 1GB for MongoDB
- **OS:** Windows 10+, macOS 10.15+, Ubuntu 20.04+

---

## 🚀 Quick Start

### Option 1: Docker (Recommended - 2 Minutes)

```bash
# 1. Clone repository
git clone https://github.com/yourusername/smart-companion.git
cd smart-companion

# 2. Create environment file
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY and JWT_SECRET

# 3. Start everything with Docker
docker-compose up -d

# 4. Access application
open http://localhost:3000
```

### Option 2: Manual Setup (10 Minutes)

```bash
# 1. Clone repository
git clone https://github.com/yourusername/smart-companion.git
cd smart-companion

# 2. Setup Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev

# 3. Setup LLM API (new terminal)
cd ../llm_api
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your GEMINI_API_KEY
python -m uvicorn main:app --reload --port 8000

# 4. Setup Frontend (new terminal)
cd ../frontend
python -m http.server 3000

# 5. Start MongoDB (new terminal)
mongod

# 6. Access application
open http://localhost:3000
```

---

## 📦 Detailed Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/smart-companion.git
cd smart-companion
```

### Step 2: Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/smart-companion
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
AI_BASE_URL=http://localhost:8000
```

Start backend:
```bash
npm run dev
```

Verify: http://localhost:5000/health

### Step 3: LLM API Setup

```bash
cd llm_api
pip install -r requirements.txt
```

Create `llm_api/.env`:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

Start LLM API:
```bash
python -m uvicorn main:app --reload --port 8000
```

Verify: http://localhost:8000/health

### Step 4: Frontend Setup

```bash
cd frontend
python -m http.server 3000
```

Or use any static file server:
```bash
npx http-server -p 3000
```

Verify: http://localhost:3000/login.html

### Step 5: MongoDB Setup

**Option A: Local MongoDB**
```bash
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Update `MONGO_URI` in `backend/.env`

---

## 🐳 Docker Deployment

### Quick Docker Setup

```bash
# 1. Run automated setup
bash setup_docker.sh  # Mac/Linux
# OR
setup_docker.bat      # Windows

# 2. Edit .env file
nano .env

# 3. Start all services
docker-compose up -d
```

### Manual Docker Setup

```bash
# 1. Create .env file
cp .env.example .env
nano .env  # Add GEMINI_API_KEY and JWT_SECRET

# 2. Build containers
docker-compose build

# 3. Start services
docker-compose up -d

# 4. Check status
docker-compose ps

# 5. View logs
docker-compose logs -f
```

### Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart a service
docker-compose restart backend

# View logs
docker-compose logs -f backend

# Rebuild after changes
docker-compose up -d --build

# Access container shell
docker-compose exec backend sh
```

---

## 📁 Project Structure

```
smart-companion/
├── README.md                    # This file
├── docker-compose.yml           # Docker orchestration
├── .env.example                 # Environment template
│
├── frontend/                    # Frontend application
│   ├── index.html              # Main app page
│   ├── login.html              # Login/register page
│   ├── Dockerfile              # Frontend container
│   ├── nginx.conf              # Nginx configuration
│   ├── css/
│   │   ├── base.css           # Core styles + dark mode
│   │   ├── layout.css         # Layout utilities
│   │   └── enhanced.css       # Premium UI components
│   └── js/
│       ├── api.js             # API client
│       ├── auth.js            # Authentication
│       ├── app.js             # Main application logic
│       ├── planner.js         # Task decomposition
│       ├── chatbot.js         # AI companion chat
│       └── settings.js        # User settings
│
├── backend/                     # Node.js backend
│   ├── server.js               # Entry point
│   ├── app.js                  # Express configuration
│   ├── package.json            # Dependencies
│   ├── Dockerfile              # Backend container
│   ├── .env.example            # Environment template
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js      # Login/register
│   │   ├── profile.controller.js   # User profiles
│   │   ├── planner.controller.js   # Task management
│   │   └── companion.controller.js # AI companion
│   ├── middleware/
│   │   ├── auth.middleware.js      # JWT verification
│   │   ├── sanitize.middleware.js  # PII removal
│   │   └── validate.middleware.js  # Input validation
│   ├── models/
│   │   ├── User.js                 # User schema
│   │   ├── StableProfile.js        # User preferences
│   │   ├── VolatileMetrics.js      # Behavioral metrics
│   │   └── TaskSession.js          # Task tracking
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── profile.routes.js
│   │   ├── planner.routes.js
│   │   └── companion.routes.js
│   ├── services/
│   │   ├── aiProxy.service.js      # LLM API client
│   │   └── aiPayloadBuilder.js     # Request formatting
│   └── utils/
│       └── hash.utils.js           # Hashing utilities
│
└── llm_api/                     # Python LLM API
    ├── main.py                 # FastAPI application
    ├── schemas.py              # Pydantic models
    ├── rules.py                # Adaptive rules engine
    ├── prompt_builder.py       # Prompt engineering
    ├── requirements.txt        # Python dependencies
    ├── Dockerfile              # LLM API container
    ├── .env.example            # Environment template
    └── companion/              # Companion module
        ├── __init__.py
        ├── router.py           # API endpoints
        ├── service.py          # Business logic
        ├── prompts.py          # Prompt templates
        ├── profiles.py         # Default profiles
        └── state.py            # State inference
```

---

## ⚙️ Configuration

### Environment Variables

#### Frontend
Configure in `frontend/js/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

#### Backend (`backend/.env`)
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/smart-companion

# Security
JWT_SECRET=your-secret-key-minimum-32-characters

# LLM API
AI_BASE_URL=http://localhost:8000
```

#### LLM API (`llm_api/.env`)
```env
# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here
```

### CORS Configuration

Update `backend/app.js`:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  // Add your production domain
  'https://yourdomain.com'
];
```

### MongoDB Configuration

**Local:**
```env
MONGO_URI=mongodb://localhost:27017/smart-companion
```

**MongoDB Atlas:**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-companion
```

---

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/login`
Login or register a user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  }
}
```

#### GET `/api/auth/me`
Get current user information.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  }
}
```

### Planner Endpoints

#### POST `/api/planner/decompose`
Decompose a task into micro-steps.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "task": "Clean my room",
  "preferences": {
    "reading_difficulty": "high",
    "prefers_micro_steps": true
  },
  "metrics": {
    "avg_time_to_first_action_seconds": 50,
    "session_abandon_rate": 0.6
  }
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "session_id",
  "steps": [
    "Pick up one item from the floor",
    "Put that item in its place",
    "Pick up the next item"
  ],
  "estimatedTime": 15
}
```

#### GET `/api/planner/sessions`
Get user's task sessions.

**Headers:** `Authorization: Bearer <token>`

### Companion Endpoints

#### POST `/api/companion/respond`
Get AI companion response.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "message": "I feel stuck",
  "currentStep": "Pick up one item"
}
```

**Response:**
```json
{
  "success": true,
  "response": "I hear you. Feeling stuck is okay. What if we just focus on this one tiny step?"
}
```

### Profile Endpoints

#### POST `/api/profile/setup`
Initial profile setup.

#### GET `/api/profile`
Get user profile.

#### PUT `/api/profile/preferences`
Update user preferences.

#### POST `/api/profile/metrics`
Update behavioral metrics.

---

## 🖼️ Screenshots

### Login Page
Clean, accessible login interface with dark mode support.

### Task Planner
Break down overwhelming tasks into manageable micro-steps.

### AI Companion
Get empathetic support and encouragement.

### Focus Mode
Distraction-free environment for executing one step at a time.

### Accessibility Features
Dark mode, dyslexia-friendly fonts, high contrast, and more.

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Cannot connect to backend"

**Symptom:** Frontend can't reach backend API

**Solutions:**
- Check backend is running: `curl http://localhost:5000/health`
- Verify `API_BASE_URL` in `frontend/js/api.js`
- Check CORS settings in `backend/app.js`
- Hard refresh browser: Ctrl+Shift+R

#### 2. "AI service unavailable"

**Symptom:** Task breakdown uses fallback steps

**Solutions:**
- Check LLM API is running: `curl http://localhost:8000/health`
- Verify `AI_BASE_URL` in `backend/.env`
- Check `GEMINI_API_KEY` in `llm_api/.env`
- Check LLM API logs for errors

#### 3. "Text invisible in dark mode"

**Symptom:** Can't see text in textareas in dark mode

**Solutions:**
- Hard refresh: Ctrl+Shift+R
- Clear browser cache
- Check `css/base.css` is loaded
- Verify no CSS errors in console

#### 4. "401 Unauthorized" on login

**Symptom:** Login fails with 401 error

**Solutions:**
- Use a different email (existing account has different password)
- Clear database and try again
- Check backend logs for "Invalid credentials"

#### 5. "MongoDB connection failed"

**Symptom:** Backend can't connect to MongoDB

**Solutions:**
- Start MongoDB: `mongod`
- Check `MONGO_URI` in `backend/.env`
- Use MongoDB Atlas if local fails
- Check MongoDB logs

### Debug Tools

#### Check All Services

Run verification script:
```bash
# Windows
test_connections.bat

# Mac/Linux
bash test_connections.sh

# Python
python validate_config.py
```

#### Check Logs

**Backend:**
```bash
# If running locally
# Check terminal output

# If running in Docker
docker-compose logs backend
```

**LLM API:**
```bash
# If running locally
# Check terminal output

# If running in Docker
docker-compose logs llm-api
```

**Frontend:**
- Open DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed requests

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### 1. Fork the Repository

```bash
git clone https://github.com/yourusername/smart-companion.git
cd smart-companion
git checkout -b feature/your-feature-name
```

### 2. Make Changes

- Follow existing code style
- Add comments for complex logic
- Update documentation if needed
- Test thoroughly

### 3. Commit Changes

```bash
git add .
git commit -m "Add: your feature description"
git push origin feature/your-feature-name
```

### 4. Create Pull Request

- Describe your changes
- Link related issues
- Add screenshots if UI changes

### Code Style

- **JavaScript:** Use semicolons, 2-space indentation
- **Python:** Follow PEP 8
- **CSS:** Use kebab-case for classes

### Testing

- Test all features manually
- Check on different browsers
- Test on mobile devices
- Verify accessibility

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Smart Companion

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Contact

- **Project Repository:** https://github.com/yourusername/smart-companion
- **Issues:** https://github.com/yourusername/smart-companion/issues
- **Discussions:** https://github.com/yourusername/smart-companion/discussions

---

## 🙏 Acknowledgments

- **Google Gemini** - For providing the LLM API
- **OpenDyslexic** - For the dyslexia-friendly font
- **Lexend Font** - For the accessible typography
- **Neurodiversity Community** - For feedback and testing
- **Open Source Community** - For the amazing tools and libraries

---

## 🎯 Roadmap

### Version 2.0 (Q2 2024)
- [ ] Mobile apps (iOS/Android)
- [ ] Voice-only mode
- [ ] Calendar integration
- [ ] Team/family features
- [ ] Habit tracking
- [ ] Analytics dashboard

### Version 2.1 (Q3 2024)
- [ ] Offline mode
- [ ] Custom themes
- [ ] Advanced statistics
- [ ] Export/import data
- [ ] Integration with productivity tools
- [ ] Community features

---

## 🌟 Star History

If this project helped you, please give it a ⭐️!

---

## 📊 Project Stats

- **Lines of Code:** ~15,000
- **Technologies:** 10+
- **Files:** 50+
- **Contributors:** Open for contributions!
- **License:** MIT

---

## 🎉 Quick Links

- [📖 Documentation](./docs/)
- [🐛 Report Bug](https://github.com/yourusername/smart-companion/issues)
- [💡 Request Feature](https://github.com/yourusername/smart-companion/issues)
- [💬 Discussions](https://github.com/yourusername/smart-companion/discussions)
- [🐳 Docker Hub](https://hub.docker.com/r/yourusername/smart-companion)

---

<div align="center">

**Made with 💙 for neurodivergent individuals**

[⬆ Back to Top](#-smart-companion)

</div>
