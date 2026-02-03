require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // ✅ Keeps access open for your phone
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

// ✅ NEW: Add this "Home Page" route for easy testing
app.get('/', (req, res) => {
  res.send("API is Live and Running!");
});

// Health check (Keep this too, it's good)
app.get('/api/health', (req, res) => {
  res.json({ status: '✅ Server is running with MongoDB' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});