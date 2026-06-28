# 🧠 clarity

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

**clarity** is a comprehensive web application specifically designed for individuals with ADHD, dyslexia, and executive function challenges. It combines AI-powered task decomposition with empathetic emotional support to help users overcome task paralysis and achieve their goals.

### The Problem We Solve

Many neurodivergent individuals struggle with:
- **Task Paralysis** - Feeling overwhelmed by large tasks
- **Executive Dysfunction** - Difficulty starting and organizing work
- **Time Blindness** - Inability to estimate task duration
- **Reading Difficulties** - Traditional interfaces are not accessible
- **Emotional Overwhelm** - Lack of judgment-free support

### Our Solution

clarity provides:
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


