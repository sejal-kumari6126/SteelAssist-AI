<h1 align="center">🤖 SteelAssist AI</h1>
<p align="center">
  AI-Powered Learning & Development Assistant
</p>

<p align="center">
  A full-stack RAG-based AI assistant for personalized employee training support.
</p>

<p align="center">

![Frontend](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=white)
![Build Tool](https://img.shields.io/badge/Build%20Tool-Vite-646CFF?logo=vite&logoColor=white)
![Language](https://img.shields.io/badge/Language-JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Backend](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)
![Framework](https://img.shields.io/badge/Framework-Express.js-000000?logo=express&logoColor=white)
![Database](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Authentication](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)
![Security](https://img.shields.io/badge/Security-bcrypt-003A70)
![AI](https://img.shields.io/badge/AI-Gemini-8E75B2?logo=google&logoColor=white)
![Architecture](https://img.shields.io/badge/Architecture-RAG-E34F26)

</p>

---
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


