 <p align="center">
         # 🤖 SteelAssist AI
</p>

<p align="center">
  AI-Powered Learning & Development Assistant
</p>

<p align="center">
  A full-stack RAG-based AI assistant for personalized employee training support.
</p>

<p align="center">

![React]![Vite](https://img.shields.io/badge/Frontend-React-blue)
![Node.js, Express.js, RESTAPIs](https://img.shields.io/badge/Backend-Node.js-green)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![AI](https://img.shields.io/badge/AI-Gemini-purple)
![RAG](https://img.shields.io/badge/Architecture-RAG-red)

</p>

## 🎯 Problem Statement

Employees often need to search through multiple training resources to find relevant information. At the same time, learning requirements can vary depending on an employee's role, department, experience, and training history.

Traditional learning systems may provide generic information rather than personalized assistance.

SteelAssist AI addresses this problem by providing an AI-based conversational interface that combines organizational training knowledge with employee context.

---

## 💡 Solution

SteelAssist AI provides a conversational L&D assistant where employees can:

- Ask training-related questions in natural language
- Get answers based on relevant training knowledge
- Receive personalized responses using employee context
- Access the system through secure authentication
- Maintain chat and message data using PostgreSQL

The system uses Retrieval-Augmented Generation (RAG) to ground AI responses in the available training knowledge.

---

## Key Features

### 🔐 Authentication
- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Protected API routes

### 🤖 AI Assistant
- Natural-language question answering
- Gemini-powered responses
- Practical and simple explanations
- Safety-aware response instructions

### 📚 Retrieval-Augmented Generation (RAG)
- Searches relevant training knowledge
- Retrieves top relevant documents
- Uses retrieved knowledge as the primary source
- Reduces unsupported AI responses

### 👤 Employee Context
The assistant can consider:

- Employee role
- Department
- Experience
- Completed training
- Pending training

This allows the system to provide more personalized learning assistance.

### 💬 Chat System
- Creates a chat for conversations
- Stores user messages
- Stores AI responses
- Persists conversation data in PostgreSQL

### 🗄️ Database
PostgreSQL is used to store:

- Users
- Chats
- Messages
- Employee-related information

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │                     │
                    │ Login / Chat UI     │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │ Node.js + Express   │
                    │                     │
                    │ Authentication      │
                    │ Chat APIs           │
                    └──────────┬──────────┘
                               │
               ┌───────────────┼───────────────┐
               │               │               │
               ▼               ▼               ▼
        ┌────────────┐  ┌─────────────┐  ┌─────────────┐
        │ PostgreSQL │  │ RAG Service │  │ Gemini API  │
        │            │  │             │  │             │
        │ Users      │  │ Knowledge   │  │ AI Answer   │
        │ Chats      │  │ Retrieval   │  │ Generation  │
        │ Messages   │  │             │  │             │
        └────────────┘  └──────┬──────┘  └─────────────┘
                               │
                               ▼
                       Employee Context
```
#  🔄 RAG Workflow

The AI response generation follows these steps:
```text
                 User Question
                      │
                      ▼
                Retrieve Relevant Training Knowledge
                      │
                      ▼
                Retrieve Employee Context
                      │
                      ▼
                Build Context
                      │
                      ▼
                Send Context + Question to Gemini
                      │
                      ▼
                Generate Answer
                      │
                      ▼
                Save Response
                      │
                      ▼
                Display Answer
```
The system instructs the AI to use retrieved training knowledge as its primary source and avoid inventing safety procedures.


