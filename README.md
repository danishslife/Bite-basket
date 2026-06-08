# BiteBasket 🍲

A full-stack recipe discovery and sharing platform where food lovers can explore, bookmark, and post their favorite recipes.

🌐 **Live Demo:** [bite-basket-iota.vercel.app](https://bite-basket-iota.vercel.app)

---

## ✨ Features

- 🔐 JWT authentication with secure httpOnly cookies
- 👤 User registration, login, and profile pages
- 🍽 Browse 50+ recipes from around the world
- 🔖 Bookmark and save favorite recipes
- 📝 Post your own recipes with a full form
- 📖 Detailed recipe modal with ingredients and instructions
- 📱 Fully responsive with mobile hamburger menu
- ⚡ Smooth scroll navigation
- 🎨 Consistent design system across all pages

---

## 🛠️ Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite
- React Router DOM v6
- Axios
- TailwindCSS + Custom CSS

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- cookie-parser

**Deployment**
- Frontend → Vercel
- Backend → Railway
- Database → MongoDB Atlas

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account

### Clone the repository

```bash
git clone https://github.com/danishslife/Bite-basket.git
cd Bite-basket
```

### Setup the backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` folder:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development

```bash
npm run dev
```

### Seed the database

```bash
npm run seed
```

### Setup the frontend

```bash
cd ../client
npm install
```

Create a `.env` file in the `client/` folder:
VITE_API_URL=http://localhost:5000/api

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📁 Project Structure
BiteBasket/
├── client/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── api/            # Axios instance
│   │   ├── components/     # Navbar, ProtectedRoute
│   │   ├── context/        # Auth context
│   │   ├── pages/          # Home, Login, Register, Profile, CreateRecipe
│   │   └── types/          # TypeScript interfaces
│   └── index.html
│
└── server/                 # Express backend
    ├── config/             # MongoDB connection
    ├── controllers/        # Route logic
    ├── middleware/         # Auth middleware
    ├── models/             # Mongoose schemas
    ├── routes/             # Express routers
    ├── utils/              # JWT token generator
    └── server.js

---

## 📝 What I Learned

- Building a full MERN stack application from scratch
- JWT authentication with httpOnly cookies and CORS configuration
- Designing and consuming a RESTful API
- Managing global state with React Context API
- TypeScript interfaces and type safety in React
- Deploying a full-stack app with separate frontend and backend services
- MongoDB data modeling with Mongoose and population
- Industry-standard folder structure and code organization

---

## 👨‍💻 Author

**Danish Abdullah**
- Portfolio: [danishabdullah.online](https://danishabdullah.online)
- GitHub: [@danishslife](https://github.com/danishslife)
