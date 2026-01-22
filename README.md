# 🚀 CRUD Web App with Authentication & MongoDB

A full-stack CRUD application with user authentication, built with:
- **Backend**: Node.js + Express + MongoDB + JWT
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript
- **Database**: MongoDB (cloud or local)

## 🎯 Features

✅ **User Authentication**
- Register with username, email, password
- Login with email and password
- JWT token-based sessions
- Secure password hashing with bcryptjs

✅ **CRUD Operations**
- Create items with title and description
- Read/View all personal items
- Update existing items
- Delete items

✅ **User-Specific Data**
- Each user only sees their own items
- Items linked to user in MongoDB
- Secure authorization checks

## 📋 Prerequisites

1. **Node.js** - [Download here](https://nodejs.org/)
2. **MongoDB** - Choose one:
   - Local: [Download MongoDB Community](https://www.mongodb.com/try/download/community)
   - Cloud: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier available)

## 🛠️ Setup Instructions

### Step 1: Backend Setup

```bash
cd backend
npm install
```

### Step 2: Configure MongoDB

Edit `.env` file in the backend folder:

```env
# For Local MongoDB
MONGODB_URI=mongodb://localhost:27017/item_manager

# For MongoDB Atlas (Cloud)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/item_manager?retryWrites=true&w=majority

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
```

### Step 3: Start the Servers

**Terminal 1 - Start MongoDB (if using local):**
```bash
mongod
```

**Terminal 2 - Start Backend:**
```bash
cd backend
npm start
```

Expected output: `✅ MongoDB connected successfully` and `🚀 Server running on http://localhost:5000`

**Terminal 3 - Start Frontend:**
```bash
cd frontend
python -m http.server 8000
```

Or use Node's `http-server`:
```bash
npx serve frontend
```

### Step 4: Open the App

Navigate to: **http://localhost:8000**

## 🔐 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/register` | Register new user | `{ username, email, password, confirmPassword }` |
| POST | `/login` | Login user | `{ email, password }` |
| GET | `/me` | Get current user info | Headers: `Authorization: Bearer {token}` |

### Item Routes (`/api/items`) - All require JWT token

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/` | Get all user's items | Headers: `Authorization: Bearer {token}` |
| POST | `/` | Create new item | `{ title, description }` + Headers: Auth |
| GET | `/:id` | Get single item | Headers: `Authorization: Bearer {token}` |
| PUT | `/:id` | Update item | `{ title, description }` + Headers: Auth |
| DELETE | `/:id` | Delete item | Headers: `Authorization: Bearer {token}` |

## 📁 Project Structure

```
web_app/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/
│   │   ├── User.js              # User schema with password hashing
│   │   └── Item.js              # Item schema
│   ├── routes/
│   │   ├── auth.js              # Authentication endpoints
│   │   └── items.js             # CRUD endpoints
│   ├── server.js                # Express server setup
│   ├── .env                     # Environment variables
│   └── package.json             # Dependencies
│
└── frontend/
    ├── index.html               # Login, Register, App pages
    ├── styles.css               # Responsive styling
    └── script.js                # All frontend logic
```

## 🔄 User Flow

1. **Register**: Create new account with username, email, password
2. **Login**: Login with email and password
3. **Dashboard**: View all your items
4. **Add Item**: Create new items
5. **Edit Item**: Click edit button to modify
6. **Delete Item**: Remove items (with confirmation)
7. **Logout**: Securely logout (token cleared)

## 🔒 Security Features

- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ JWT tokens with 7-day expiration
- ✅ Protected routes - token validation on each request
- ✅ User-specific data access - users can only see their items
- ✅ Input sanitization - XSS prevention
- ✅ CORS enabled for frontend-backend communication

## 🚨 Troubleshooting

### "Cannot connect to MongoDB"
- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env` file
- For MongoDB Atlas, verify IP whitelist includes your IP

### "Cannot GET /" on frontend
- Ensure Python HTTP server is running on port 8000
- Use `http://localhost:8000` (not 5000)

### "Invalid token" errors
- Clear browser localStorage: `localStorage.clear()`
- Login again to get fresh token
- Check JWT_SECRET in `.env`

### CORS errors
- Verify backend is running on port 5000
- Check CORS middleware in server.js

## 🚀 Deployment

### Backend (Heroku Example)
```bash
heroku create your-app-name
git push heroku main
```

### Frontend (Vercel Example)
```bash
npm install -g vercel
vercel
```

Update `API_BASE_URL` in `script.js` to your deployed backend URL.

## 📚 Technology Stack

- **Express.js** - REST API framework
- **Mongoose** - MongoDB object modeling
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **CORS** - Cross-origin requests
- **dotenv** - Environment variables

## 💡 Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Item categories/tags
- [ ] Search and filter items
- [ ] Pagination
- [ ] Dark mode theme
- [ ] Mobile app
- [ ] Real-time updates with WebSockets
- [ ] Item sharing/collaboration

## 📄 License

MIT License - Feel free to use this project!

## 🤝 Contributing

Found a bug? Have suggestions? Feel free to contribute!

---

**Happy Coding! 🎉**

