const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Ensure mongoose is required
const Entry = require('../models/Entry');

// Monthly Expenses Breakdown
router.get('/monthly-expenses', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'userId is required' });

    const expenses = await Entry.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), type: 'Expense' } },
      { $group: { _id: { month: { $month: '$date' }, year: { $year: '$date' } }, total: { $sum: '$amount' } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.status(200).json(expenses);
  } catch (error) {
    console.error('Error fetching monthly expenses:', error); // Add logging
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Income vs Expense Comparison
router.get('/income-vs-expense', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'userId is required' });

    const comparison = await Entry.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$type', total: { $sum: '$amount' } } }
    ]);

    res.status(200).json(comparison);
  } catch (error) {
    console.error('Error fetching income vs expense:', error); // Add logging
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Category-wise Expense Distribution
router.get('/category-expenses', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'userId is required' });

    const categoryExpenses = await Entry.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), type: 'Expense' } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } }
    ]);

    res.status(200).json(categoryExpenses);
  } catch (error) {
    console.error('Error fetching category expenses:', error); 
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;