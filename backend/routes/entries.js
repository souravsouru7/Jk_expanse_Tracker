const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');

// Add an entry (Income/Expense)

router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const entries = await Entry.find({ userId }).sort({ date: -1 });
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



router.post('/', async (req, res) => {
  try {
    const { userId, type, amount, category, description, date } = req.body;

    // Validate required fields
    if (!userId || !type || !amount || !category) {
      return res.status(400).json({ 
        message: 'userId, type, amount and category are required fields' 
      });
    }

    // Create new entry
    const entry = new Entry({
      userId,
      type,
      amount,
      category,
      description,
      date: date || Date.now()
    });

    await entry.save();

    res.status(201).json({ message: 'Entry created successfully', entry });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



// Update an entry
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, category, description, date } = req.body;

    const entry = await Entry.findByIdAndUpdate(
      id,
      { type, amount, category, description, date },
      { new: true }
    );

    if (!entry) return res.status(404).json({ message: 'Entry not found' });

    res.status(200).json({ message: 'Entry updated successfully', entry });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete an entry
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const entry = await Entry.findByIdAndDelete(id);

    if (!entry) return res.status(404).json({ message: 'Entry not found' });

    res.status(200).json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
