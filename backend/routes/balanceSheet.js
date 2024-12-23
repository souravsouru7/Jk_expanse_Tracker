const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Add this line
const Entry = require('../models/Entry');


// Get overall balance sheet summary
router.get('/summary', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    // Calculate total income
    const totalIncome = await Entry.aggregate([
      { 
        $match: { 
          userId: new mongoose.Types.ObjectId(userId),
          type: 'Income'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Calculate total expenses
    const totalExpenses = await Entry.aggregate([
      { 
        $match: { 
          userId: new mongoose.Types.ObjectId(userId),
          type: 'Expense'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const balance = {
      totalIncome: totalIncome[0]?.total || 0,
      totalExpenses: totalExpenses[0]?.total || 0,
      netBalance: (totalIncome[0]?.total || 0) - (totalExpenses[0]?.total || 0)
    };

    res.status(200).json(balance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get monthly breakdown
router.get('/monthly', async (req, res) => {
  try {
    const { userId, year } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const yearToQuery = parseInt(year) || new Date().getFullYear();

    const monthlyBreakdown = await Entry.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: {
            $gte: new Date(yearToQuery, 0, 1),
            $lt: new Date(yearToQuery + 1, 0, 1)
          }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      {
        $group: {
          _id: '$_id.month',
          income: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'Income'] }, '$total', 0]
            }
          },
          expenses: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'Expense'] }, '$total', 0]
            }
          }
        }
      },
      {
        $project: {
          month: '$_id',
          income: 1,
          expenses: 1,
          balance: { $subtract: ['$income', '$expenses'] },
          _id: 0
        }
      },
      { $sort: { month: 1 } }
    ]);

    res.status(200).json(monthlyBreakdown);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get yearly breakdown
router.get('/yearly', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const yearlyBreakdown = await Entry.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      {
        $group: {
          _id: '$_id.year',
          income: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'Income'] }, '$total', 0]
            }
          },
          expenses: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'Expense'] }, '$total', 0]
            }
          }
        }
      },
      {
        $project: {
          year: '$_id',
          income: 1,
          expenses: 1,
          balance: { $subtract: ['$income', '$expenses'] },
          _id: 0
        }
      },
      { $sort: { year: 1 } }
    ]);

    res.status(200).json(yearlyBreakdown);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;