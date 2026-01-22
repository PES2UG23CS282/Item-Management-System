const express = require('express');
const Item = require('../models/Item');
const protect = require('../middleware/auth');

const router = express.Router();

// CREATE - Add a new item (protected)
router.post('/', protect, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newItem = new Item({
      userId: req.userId,
      title,
      description: description || '',
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Get all items for logged-in user (protected)
router.get('/', protect, async (req, res) => {
  try {
    const items = await Item.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
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
    const { title, description } = req.body;

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

    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Remove an item (protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Check if item belongs to the user
    if (item.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this item' });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully', item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
