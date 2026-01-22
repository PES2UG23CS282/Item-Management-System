# ⚡ QUICK START GUIDE

## 🚀 Start App in 3 Commands

### Terminal 1 - Backend:
```bash
cd backend && npm start
```

### Terminal 2 - Frontend:
```bash
cd frontend && python -m http.server 8000
```

### Browser:
```
http://localhost:8000
```

---

## 🧪 Test It

1. **Register**: Click "Register here" → Fill form → Submit
2. **Login**: Use your email & password
3. **Add Item**: Enter title → Add Item
4. **Edit Item**: Click "Edit" → Modify → Update
5. **Delete Item**: Click "Delete" → Confirm

---

## 🗄️ View Data in MongoDB

### See User Login Details:
```bash
mongo
use item_manager
db.users.find().pretty()
```

### See Item Details:
```bash
db.items.find().pretty()
```

👉 **Full guide in [MONGODB_GUIDE.md](MONGODB_GUIDE.md)**

---

## 📁 Project Structure

```
Item_manager/
├── backend/
│   ├── .env                 (Config - MongoDB URI)
│   ├── server.js            (Express server)
│   ├── package.json
│   ├── config/database.js   (MongoDB connection)
│   ├── models/              (User.js, Item.js)
│   ├── middleware/auth.js   (JWT verification)
│   └── routes/              (auth.js, items.js)
│
└── frontend/
    ├── index.html           (3 pages: login, register, dashboard)
    ├── styles.css           (Responsive styling)
    └── script.js            (App logic)
```

---

## 🔑 Key Features

✅ User Registration & Login
✅ JWT Authentication
✅ Password Hashing
✅ MongoDB Database
✅ CRUD Operations
✅ User-Specific Items
✅ Responsive Design

---

## ⚙️ Configuration

Edit `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/item_manager
JWT_SECRET=your_secret_key
PORT=5000
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port already in use | Kill process: `Get-Process node \| Stop-Process -Force` |
| MongoDB not connecting | Start MongoDB: `mongod` |
| Frontend "Cannot GET" | Use port 8000: `python -m http.server 8000` |

---

## 📚 Full Documentation

- 📖 [README.md](README.md) - Complete documentation
- 🗄️ [MONGODB_GUIDE.md](MONGODB_GUIDE.md) - How to view data in MongoDB

---

**Ready to go! 🎉**
