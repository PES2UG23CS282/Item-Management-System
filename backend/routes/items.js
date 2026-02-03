const express = require('express');
const Item = require('../models/Item');
const protect = require('../middleware/auth');

const router = express.Router();

// CREATE - Add a new item (protected)
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, priority, status } = req.body;
    console.log('📝 Creating item:', { title, description, priority, status, userId: req.userId });

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newItem = new Item({
      userId: req.userId,
      title,
      description: description || '',
      priority: priority || 'medium',
      status: status || 'pending',
    });

    await newItem.save();
    console.log('✅ Item created:', newItem);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('❌ Error creating item:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// READ - Get all items for logged-in user (protected)
router.get('/', protect, async (req, res) => {
  try {
    console.log('📋 Fetching items for user:', req.userId);
    const items = await Item.find({ userId: req.userId }).sort({ createdAt: -1 });
    console.log(`✅ Found ${items.length} items`);
    res.json(items);
  } catch (error) {
    console.error('❌ Error fetching items:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// READ - Get a single item by ID (protected)
router.get('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Check if item belongs to the user
    if (item.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to access this item' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE - Modify an existing item (protected)
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, description, priority, status } = req.body;
    console.log('🔄 Updating item:', { id: req.params.id, title, description, priority, status });

    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Check if item belongs to the user
    if (item.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to update this item' });
    }

    if (title) item.title = title;
    if (description !== undefined) item.description = description;
    if (priority) item.priority = priority;
    if (status) item.status = status;

    await item.save();
    console.log('✅ Item updated:', item);
    res.json(item);
  } catch (error) {
    console.error('❌ Error updating item:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Remove an item (protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    console.log('🗑️ Deleting item:', req.params.id);
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Check if item belongs to the user
    if (item.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this item' });
    }

    await Item.findByIdAndDelete(req.params.id);
    console.log('✅ Item deleted:', req.params.id);
    res.json({ message: 'Item deleted successfully', item });
  } catch (error) {
    console.error('❌ Error deleting item:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
