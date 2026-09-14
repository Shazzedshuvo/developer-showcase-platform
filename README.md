# Portfolio Showcase + Admin Dashboard

A full-stack MERN application to showcase web development projects (Wix, Squarespace, Custom Code, etc.) with a secure JWT-authenticated admin dashboard.

---

## 🗂️ Project Structure

```
project/
├── server/   — Express + Node.js API (port 5000)
└── client/   — Vite + React frontend (port 5173)
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js v18+
- MongoDB running locally (`mongodb://localhost:27017`) **or** MongoDB Atlas URI
- Cloudinary account (free tier) for image uploads

### 2. Configure Environment Variables

**Server** — copy `server/.env.example` → `server/.env` and fill in:
```env
MONGO_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your_long_random_secret
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin@1234
```

**Client** — `client/.env` is already pre-filled:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Install Dependencies

```bash
# Server
cd server && npm install

# Client
cd ../client && npm install
```

### 4. Seed Admin User

```bash
cd server
node seed.js
```

> ⚠️ This creates the admin account. **Change the password after first login!**

### 5. Start Development Servers

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# → http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# → http://localhost:5173
```

---

## 🔐 Admin Access

| URL | Description |
|-----|-------------|
| `http://localhost:5173/admin/login` | Admin login page |
| `http://localhost:5173/admin` | Dashboard overview |
| `http://localhost:5173/admin/categories` | Manage categories |
| `http://localhost:5173/admin/projects` | Manage projects |
| `http://localhost:5173/admin/reviews` | Upload Fiverr reviews |

**Default credentials** (from seed.js):
- Username: `admin`
- Password: `Admin@1234`

---

## 🛠️ API Reference

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/login` | ❌ | Login → sets httpOnly cookie |
| POST | `/api/auth/logout` | ✅ | Clears cookie |
| GET | `/api/auth/me` | ❌ | Session check |
| GET | `/api/categories` | ❌ | List all categories |
| POST | `/api/categories` | ✅ | Create category |
| PUT | `/api/categories/:id` | ✅ | Update category |
| DELETE | `/api/categories/:id` | ✅ | Delete category |
| GET | `/api/projects` | ❌ | List projects (`?category=slug&featured=true`) |
| GET | `/api/projects/:slug` | ❌ | Single project |
| POST | `/api/projects` | ✅ | Create project + upload images |
| PUT | `/api/projects/:id` | ✅ | Update project |
| DELETE | `/api/projects/:id` | ✅ | Delete project + Cloudinary cleanup |
| GET | `/api/reviews` | ❌ | List reviews |
| POST | `/api/reviews` | ✅ | Upload review screenshot |
| DELETE | `/api/reviews/:id` | ✅ | Delete review + Cloudinary cleanup |

---

## 🚀 Production Deployment

1. Build the client: `cd client && npm run build`
2. Serve `client/dist` via nginx or upload to Vercel/Netlify
3. Deploy server to Railway/Render/Heroku — set all `.env` values as environment variables
4. Update `CLIENT_URL` in server `.env` to your production frontend URL

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT (httpOnly cookies), bcryptjs |
| Images | Cloudinary SDK, Multer |
| Icons | Lucide React |
| Notifications | react-hot-toast |
