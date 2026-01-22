# 🗄️ HOW TO VIEW DATA IN MONGODB

## 🎯 **EASIEST WAY: MongoDB Extension in VS Code**

### ✅ Using MongoDB Extension (Recommended!)

1. **Open MongoDB in VS Code:**
   - Click the **MongoDB icon** in the left sidebar (looks like a leaf 🍃)
   - Or press `Ctrl+Shift+P` and search "MongoDB"

2. **Connect to Your Database:**
   - Click **"Add Connection"** or the **+ icon**
   - Select **"Connect with Connection String"**
   - Use this connection string:
     ```
     mongodb://localhost:27017
     ```
   - Click **"Connect"**

3. **View Your Data:**
   - Expand **`item_manager`** database
   - Click **`users`** collection → see all login details
   - Click **`items`** collection → see all items
   - Click any document to view full details

4. **Search Data in Extension:**
   - Right-click collection → **"View Collection"**
   - Add filters like: `{ email: "test@example.com" }`

---

## 🔐 **LOGIN DETAILS (Users Collection)**

### 📊 View All Users in Extension:
1. Click MongoDB extension icon 🍃
2. Expand `item_manager` → `users`
3. See all user records instantly

### Via Terminal (Alternative):
```bash
mongo
use item_manager
db.users.find().pretty()
```

### 👤 View Specific User:
```bash
db.users.findOne({ email: "test@example.com" })
```

### 📋 User Data Structure:
```javascript
{
  _id: ObjectId("..."),
  username: "testuser",
  email: "test@example.com",
  password: "$2a$10$encrypted...",  // Hashed - NOT readable
  createdAt: ISODate("2026-01-22T..."),
  updatedAt: ISODate("2026-01-22T...")
}
```

---

## 📦 **ITEM DETAILS (Items Collection)**

### 📊 View All Items in Extension:
1. Click MongoDB extension icon 🍃
2. Expand `item_manager` → `items`
3. See all item records with userId links

### Via Terminal (Alternative):
```bash
mongo
use item_manager
db.items.find().pretty()
```

### 🔍 View Items for Specific User (Extension):
1. Right-click `items` → **"View Collection"**
2. Add filter: `{ userId: ObjectId("USER_ID_HERE") }`
3. See only that user's items

### 📋 Item Data Structure:
```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),  // Links to user
  title: "My First Item",
  description: "Item description",
  createdAt: ISODate("2026-01-22T..."),
  updatedAt: ISODate("2026-01-22T...")
}
```

---

## ⚙️ **MONGODB COMMANDS REFERENCE**

### Connect to MongoDB:
```bash
mongo
```

### Show Databases:
```bash
show dbs
```

### Use Database:
```bash
use item_manager
```

### Show Collections:
```bash
show collections
```

### View All Users:
```bash
db.users.find().pretty()
```

### View All Items:
```bash
db.items.find().pretty()
```

### Count Users:
```bash
db.users.countDocuments()
```

### Count Items:
```bash
db.items.countDocuments()
```

### Count User's Items:
```bash
db.items.countDocuments({ userId: ObjectId("USER_ID") })
```

### Delete a User:
```bash
db.users.deleteOne({ email: "test@example.com" })
```

### Delete All Items:
```bash
db.items.deleteMany({})
```

### Update a User:
```bash
db.users.updateOne(
  { email: "test@example.com" },
  { $set: { username: "newusername" } }
)
```

---

## 🌐 **USING MONGODB COMPASS (GUI)**

### Download:
Visit: https://www.mongodb.com/products/compass

### Connect:
1. Open MongoDB Compass
2. Click "Connect"
3. Use: `mongodb://localhost:27017`
4. Click "Connect"

### View Data:
1. Expand "item_manager" database
2. Click "users" → See all users
3. Click "items" → See all items

### Features:
- 🔍 Search/Filter
- 📊 Visualize data
- ✏️ Edit documents
- 🗑️ Delete documents

---

## 🔗 **RELATIONSHIP: USERS ↔ ITEMS**

### Find User and Their Items:
```bash
# Get user
user = db.users.findOne({ email: "test@example.com" })

# Get their items
db.items.find({ userId: user._id }).pretty()
```

### Count User's Items:
```bash
db.items.countDocuments({ userId: ObjectId("USER_ID_HERE") })
```

### Find User of an Item:
```bash
item = db.items.findOne({ _id: ObjectId("ITEM_ID_HERE") })
user = db.users.findOne({ _id: item.userId })
user
```

---

## 🗄️ **DATABASE STRUCTURE**

```
item_manager (Database)
├── users (Collection)
│   └── _id
│   ├── username
│   ├── email
│   ├── password (hashed)
│   ├── createdAt
│   └── updatedAt
│
└── items (Collection)
    ├── _id
    ├── userId (reference to users)
    ├── title
    ├── description
    ├── createdAt
    └── updatedAt
```

---

## 📝 **EXAMPLE COMMANDS**

### View All Data:
```bash
mongo
use item_manager

# Show all users
db.users.find().pretty()

# Show all items
db.items.find().pretty()
```

### Create Test User (Manual):
```bash
db.users.insertOne({
  username: "john",
  email: "john@example.com",
  password: "hashed_password_here",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Get User ID:
```bash
db.users.findOne({ email: "test@example.com" })._id
```

### Get User's Items Count:
```bash
userId = ObjectId("PASTE_USER_ID_HERE")
db.items.countDocuments({ userId: userId })
```

### Find Items by Title:
```bash
db.items.find({ title: /item/i }).pretty()  // Case insensitive search
```

---

## 🔒 **PASSWORD HASHING NOTE**

⚠️ **Passwords are HASHED with bcryptjs**
- You cannot read them
- You cannot decrypt them
- This is for security!
- To verify: Use login endpoint with email & password

Example hashed password:
```
$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36jqq3Be
```

---

## 🧪 **QUICK TEST**

### 1. Register User Via App:
- Go to http://localhost:8000
- Register: testuser / test@example.com / test123456

### 2. View in MongoDB:
```bash
mongo
use item_manager
db.users.findOne({ username: "testuser" })
```

### 3. Add Item Via App:
- Login
- Add item: "Test Item" / "Test Description"

### 4. View in MongoDB:
```bash
db.items.find().pretty()
```

---

## 💡 **TIPS**

- Use `.pretty()` for readable format
- Use `.limit(5)` to limit results: `db.users.find().limit(5)`
- Use `.sort()` to sort: `db.items.find().sort({ createdAt: -1 })`
- `-1` = descending, `1` = ascending

---

## 🚀 **MONGODB ATLAS (CLOUD)**

If using MongoDB Atlas instead of local:

### View Data Online:
1. Go to https://cloud.mongodb.com
2. Login to your account
3. Click "Collections"
4. Select database "item_manager"
5. See "users" and "items"
6. Click to view documents

### Connect String for Local Client:
```
mongodb+srv://user:password@cluster.mongodb.net/item_manager
```

---

## ✅ **QUICK COMMANDS SUMMARY**

```bash
# Start MongoDB
mongod

# Connect to MongoDB
mongo

# Select database
use item_manager

# View all users
db.users.find().pretty()

# View all items
db.items.find().pretty()

# Count users
db.users.countDocuments()

# Count items
db.items.countDocuments()

# Exit MongoDB
exit
```

---

**You can now view and manage all your data! 🎉**
