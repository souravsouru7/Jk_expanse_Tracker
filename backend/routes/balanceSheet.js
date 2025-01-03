const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Add this line
const Entry = require('../models/Entry');


// Get overall balance sheet summary
router.get('/summary', async (req, res) => {
  try {
    const { userId, projectId } = req.query;
    
    if (!userId || !projectId) {
      return res.status(400).json({ message: 'userId and projectId are required' });
    }

    const totalIncome = await Entry.aggregate([
      { 
        $match: { 
          userId: new mongoose.Types.ObjectId(userId),
          projectId: new mongoose.Types.ObjectId(projectId),
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

    const totalExpenses = await Entry.aggregate([
      { 
        $match: { 
          userId: new mongoose.Types.ObjectId(userId),
          projectId: new mongoose.Types.ObjectId(projectId),
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

    // Calculate totals with default values if no entries exist
    const incomeTotal = totalIncome[0]?.total || 0;
    const expenseTotal = totalExpenses[0]?.total || 0;
    const netBalance = incomeTotal - expenseTotal;

    // Format response
    const balance = {
      totalIncome: incomeTotal,
      totalExpenses: expenseTotal,
      netBalance: netBalance,
      currency: 'USD', // Add currency if needed
      lastUpdated: new Date()
    };

    res.status(200).json(balance);

  } catch (error) {
    console.error('Balance summary error:', error);
    res.status(500).json({ 
      message: 'Server error while fetching balance summary', 
      error: error.message 
    });
  }
});

// Get monthly breakdown
router.get('/monthly', async (req, res) => {
  try {
    const { userId, projectId, year } = req.query;
    
    if (!userId || !projectId) {
      return res.status(400).json({ message: 'userId and projectId are required' });
    }

    const yearToQuery = parseInt(year) || new Date().getFullYear();

    const monthlyBreakdown = await Entry.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          projectId: new mongoose.Types.ObjectId(projectId),
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
      { 
        $sort: { month: 1 } 
      }
    ]);

    // Fill in missing months with zero values
    const completeMonthlyData = Array.from({ length: 12 }, (_, i) => {
      const existingData = monthlyBreakdown.find(item => item.month === i + 1);
      return existingData || {
        month: i + 1,
        income: 0,
        expenses: 0,
        balance: 0
      };
    });

    res.status(200).json(completeMonthlyData);
  } catch (error) {
    console.error('Monthly breakdown error:', error);
    res.status(500).json({ 
      message: 'Server error while fetching monthly breakdown', 
      error: error.message 
    });
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
// Add this new route to existing balanceSheet.js

// Get overall summary across all projects
router.get('/overall-summary', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    // Get overall totals
    const overallSummary = await Entry.aggregate([
      { 
        $match: { 
          userId: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Get project-wise breakdown
    const projectBreakdown = await Entry.aggregate([
      { 
        $match: { 
          userId: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $group: {
          _id: {
            projectId: '$projectId',
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      {
        $group: {
          _id: '$_id.projectId',
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
        $lookup: {
          from: 'projects',
          localField: '_id',
          foreignField: '_id',
          as: 'projectInfo'
        }
      },
      {
        $project: {
          projectName: { $arrayElemAt: ['$projectInfo.name', 0] },
          income: 1,
          expenses: 1,
          balance: { $subtract: ['$income', '$expenses'] }
        }
      }
    ]);

    // Calculate overall totals
    const totalIncome = overallSummary.find(item => item._id === 'Income')?.total || 0;
    const totalExpenses = overallSummary.find(item => item._id === 'Expense')?.total || 0;

    const response = {
      overall: {
        totalIncome,
        totalExpenses,
        netBalance: totalIncome - totalExpenses,
      },
      projectWise: projectBreakdown,
      lastUpdated: new Date()
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Overall summary error:', error);
    res.status(500).json({ 
      message: 'Server error while fetching overall summary', 
      error: error.message 
    });
  }
});


router.delete('/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    // Find project and verify ownership
    const project = await Project.findOne({ _id: projectId, userId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found or unauthorized' });
    }

    // Delete all entries associated with this project
    await Entry.deleteMany({ projectId, userId });

    // Delete the project
    await Project.findByIdAndDelete(projectId);

    res.status(200).json({ 
      message: 'Project and associated entries deleted successfully' 
    });

  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ 
      message: 'Server error while deleting project', 
      error: error.message 
    });
  }
});

module.exports = router;