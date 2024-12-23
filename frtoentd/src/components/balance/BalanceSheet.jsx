import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  fetchBalanceSummary,
  fetchMonthlyBreakdown,
  fetchYearlyBreakdown,
} from '../../store/slice/balanceSheetSlice';

const BalanceSheet = () => {
  const dispatch = useDispatch();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState('monthly');
  
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?._id || user?.id;

  const { summary, monthly, yearly } = useSelector((state) => state.balanceSheet);

  useEffect(() => {
    if (userId) {
      dispatch(fetchBalanceSummary(userId));
      dispatch(fetchMonthlyBreakdown({ userId, year: selectedYear }));
      dispatch(fetchYearlyBreakdown(userId));
    }
  }, [dispatch, userId, selectedYear]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (!userId) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 text-red-600 text-center font-semibold bg-red-50 rounded-lg shadow-lg"
      >
        Please log in to view the balance sheet.
      </motion.div>
    );
  }

  if (summary.error || monthly.error || yearly.error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 text-red-600 text-center font-semibold bg-red-50 rounded-lg shadow-lg"
      >
        Error loading data: {summary.error || monthly.error || yearly.error}
      </motion.div>
    );
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Overall Summary */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="mb-8 bg-white rounded-xl shadow-2xl p-8 transform hover:scale-102 transition-transform duration-300"
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">Overall Summary</h2>
        {summary.loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-green-400 to-green-600 p-6 rounded-lg shadow-lg transform hover:rotate-1 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-white mb-2">Total Income</h3>
              <p className="text-3xl font-bold text-white">₹{(summary.totalIncome || 0).toFixed(2)}</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-red-400 to-red-600 p-6 rounded-lg shadow-lg transform hover:rotate-1 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-white mb-2">Total Expenses</h3>
              <p className="text-3xl font-bold text-white">₹{(summary.totalExpenses || 0).toFixed(2)}</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-blue-400 to-blue-600 p-6 rounded-lg shadow-lg transform hover:rotate-1 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-white mb-2">Net Balance</h3>
              <p className="text-3xl font-bold text-white">₹{(summary.netBalance || 0).toFixed(2)}</p>
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('monthly')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            activeTab === 'monthly'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          Monthly Breakdown
        </button>
        <button
          onClick={() => setActiveTab('yearly')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            activeTab === 'yearly'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          Yearly Breakdown
        </button>
      </div>

      {/* Monthly/Yearly Content */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="bg-white rounded-xl shadow-2xl p-8"
      >
        {activeTab === 'monthly' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Monthly Breakdown</h2>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {(yearly.data.length > 0 ? yearly.data : [{ year: new Date().getFullYear() }])
                  .map((year) => (
                    <option key={year.year} value={year.year}>{year.year}</option>
                  ))}
              </select>
            </div>
            {monthly.loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Month</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Income</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Expenses</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {monthly.data.map((month, index) => (
                      <motion.tr 
                        key={month.month}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 text-sm text-gray-800 font-medium">{monthNames[month.month - 1]}</td>
                        <td className="px-6 py-4 text-sm text-green-600 font-semibold">₹{(month.income || 0).toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm text-red-600 font-semibold">₹{(month.expenses || 0).toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm text-blue-600 font-semibold">₹{(month.balance || 0).toFixed(2)}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeTab === 'yearly' && (
          <>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Yearly Breakdown</h2>
            {yearly.loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Year</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Income</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Expenses</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {yearly.data.map((year, index) => (
                      <motion.tr 
                        key={year.year}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 text-sm text-gray-800 font-medium">{year.year}</td>
                        <td className="px-6 py-4 text-sm text-green-600 font-semibold">₹{(year.income || 0).toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm text-red-600 font-semibold">₹{(year.expenses || 0).toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm text-blue-600 font-semibold">₹{(year.balance || 0).toFixed(2)}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default BalanceSheet;