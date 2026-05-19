# AI-Based Smart Complaint Management System

A full-stack **MERN** (MongoDB, Express, React, Node.js) application that allows users to register complaints online. The system uses **AI APIs** to classify complaint priority, generate automated responses, and recommend the concerned department.

## 🚀 Features

- **Complaint Registration** – Users can submit complaints with name, email, title, description, category, location
- **Complaint Tracking** – View all complaints, filter by category/status, search by location
- **AI-Based Complaint Analysis** – Detect urgency, suggest responsible department, generate summary & auto-response
- **Secure Authentication** – JWT + bcrypt password hashing with protected routes
- **Admin Panel** – Update complaint status, delete complaints

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js (Vite), React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT + bcryptjs |
| AI | OpenRouter API + Rule-based fallback |
| Styling | Vanilla CSS (Dark Glass Design) |

## 📁 Project Structure

```
AI-Based Smart Complaint Management System/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Register, Login, GetMe
│   │   ├── complaintController.js  # CRUD + Search
│   │   └── aiController.js    # AI Analysis
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT protect + adminOnly
│   │   └── validate.js        # Express-validator middleware
│   ├── models/
│   │   ├── Complaint.js       # Mongoose Complaint schema
│   │   └── User.js            # Mongoose User schema (bcrypt)
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── complaintRoutes.js
│   │   └── aiRoutes.js
│   ├── .env                   # Environment variables
│   └── server.js              # Express app entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ComplaintCard.jsx
    │   │   └── Badges.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── SubmitComplaint.jsx  # Q1 - Complaint Registration Form
    │   │   ├── ComplaintList.jsx    # Q1 - Complaint List Page
    │   │   ├── ComplaintDetail.jsx
    │   │   ├── UpdateStatus.jsx     # Q1 - Status Update Page
    │   │   ├── AIAnalysis.jsx       # Q1 - AI Analysis Result Display
    │   │   └── Auth.jsx             # Q6 - Login & Signup
    │   ├── services/
    │   │   └── api.js              # Axios API service
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env
    └── index.html
```

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

```bash
cd backend
npm install
```

Edit `.env`:
```
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
OPENROUTER_API_KEY=your_openrouter_key   # optional - rule-based fallback works without it
NODE_ENV=development
```

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (protected) |

### Complaints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/complaints` | Add complaint |
| GET | `/api/complaints` | Get all complaints |
| GET | `/api/complaints/:id` | Get single complaint |
| PUT | `/api/complaints/:id` | Update status (Admin) |
| DELETE | `/api/complaints/:id` | Delete complaint (Admin) |
| GET | `/api/complaints/search?location=Ghaziabad` | Search by location |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/analyze` | Analyze complaint with AI |
| POST | `/api/ai/analyze-all` | Bulk analyze all complaints (Admin) |

## 🤖 AI Features

1. **Complaint Priority Detection** – Critical / High / Medium / Low
2. **Department Recommendation** – Routes to correct govt department
3. **Complaint Summary** – Concise 1-2 sentence summary
4. **Auto-generated User Response** – Professional response message

> The AI uses OpenRouter API (GPT-3.5-Turbo). If no API key is set, a smart rule-based fallback analyzes the complaint using keyword detection.

## 🔒 Security

- Passwords hashed with **bcrypt** (salt rounds: 10)
- **JWT tokens** expire in 7 days
- Admin routes protected with `protect` + `adminOnly` middleware
- Input validated with **express-validator**

## 🚀 Deployment on Render

### Backend
- Service Type: Web Service
- Build Command: `npm install`
- Start Command: `node server.js`
- Environment Variables: `MONGO_URI`, `JWT_SECRET`, `OPENROUTER_API_KEY`, `NODE_ENV=production`, `FRONTEND_URL`

### Frontend
- Service Type: Static Site
- Build Command: `npm run build`
- Publish Directory: `dist`
- Rewrite Rule: `/*` → `/index.html` (for React Router)
- Environment Variable: `VITE_API_URL=https://your-backend.onrender.com/api`

## 📋 MongoDB Schema

### Complaint Schema
```js
{
  name: String (required),
  email: String (required, validated),
  title: String (required),
  description: String (required),
  category: String (enum: 7 types),
  location: String (required),
  status: { type: String, default: 'Pending' },
  aiPriority: String,
  aiDepartment: String,
  aiSummary: String,
  aiResponse: String,
  timestamps: true
}
```

## 👥 Test Credentials

To test admin features, register a user then manually set `role: "admin"` in MongoDB.

---

Made with ❤️ using MERN Stack + AI Integration
