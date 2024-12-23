import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addEntry, updateEntry } from '../../store/slice/entrySlice';

const EntryForm = ({ entry, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(
    entry || { type: 'Income', amount: '', category: '', description: '' }
  );
  
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Get user data and validate
      const userStr = localStorage.getItem('user');
      console.log('User data from localStorage:', userStr);
      
      const user = JSON.parse(userStr);
      const userId = user?._id || user?.id;
      
      if (!userId) {
        setError('User ID not found. Please login again.');
        return;
      }

      // Prepare entry data
      const entryData = {
        ...formData,
        userId,
        amount: parseFloat(formData.amount),
        date: new Date().toISOString()
      };

      console.log('Submitting entry data:', entryData);

      // Handle update or create
      if (entry) {
        await dispatch(updateEntry({ id: entry._id, updates: entryData })).unwrap();
      } else {
        await dispatch(addEntry(entryData)).unwrap();
      }

      onClose && onClose();
    } catch (err) {
      setError(err.message || 'Failed to save entry');
      console.error('Error saving entry:', err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 bg-white rounded-lg shadow-lg transform transition-all duration-300 hover:shadow-xl"
    >
      {error && (
        <div className="text-red-500 text-sm mb-4">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        >
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Amount</label>
        <input
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          required
          min="0"
          step="0.01"
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <input
          type="text"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transform transition-all duration-200 hover:scale-105"
      >
        {entry ? 'Update' : 'Save'}
      </button>
    </form>
  );
};

export default EntryForm;