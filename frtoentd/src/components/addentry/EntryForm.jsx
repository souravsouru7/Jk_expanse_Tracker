import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addEntry, updateEntry } from '../../store/slice/entrySlice';
import { fetchProjects } from '../../store/slice/projectSlice';

const EntryForm = ({ entry, onClose }) => {
  const dispatch = useDispatch();
  const selectedProject = useSelector(state => state.projects.selectedProject);
  const projects = useSelector(state => state.projects.projects);
  const [formData, setFormData] = useState(
    entry || { 
      type: 'Income', 
      amount: '', 
      category: '', 
      description: '',
      projectId: selectedProject?._id || ''
    }
  );
  
  const [error, setError] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?._id || user?.id) {
      dispatch(fetchProjects(user?._id || user?.id));
    }
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProject) {
      setError('Please select a project first');
      return;
    }

    try {
      const userStr = localStorage.getItem('user');
      const user = JSON.parse(userStr);
      const userId = user?._id || user?.id;
      
      if (!userId) {
        setError('User ID not found. Please login again.');
        return;
      }

      if (!formData.projectId) {
        setError('Please select a project first');
        return;
      }

      const entryData = {
        ...formData,
        projectId: selectedProject._id, // Add projectId to the entry
        userId: user?._id || user?.id,
        amount: parseFloat(formData.amount),
        date: new Date().toISOString()
      };

      console.log('Submitting entry data:', entryData);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 bg-white rounded-lg shadow-lg transform transition-all duration-300 hover:shadow-xl"
    >
      {error && (
        <div className="text-red-500 text-sm mb-4 p-2 bg-red-50 rounded border border-red-200">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Project</label>
        <select
          name="projectId"
          value={formData.projectId}
          onChange={handleInputChange}
          required
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        >
          <option value="">Select a project</option>
          {projects.map(project => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleInputChange}
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
          name="amount"
          value={formData.amount}
          onChange={handleInputChange}
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
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          required
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />
      </div>

      <div className="flex space-x-4 mt-6">
        <button
          type="submit"
          className="flex-1 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transform transition-all duration-200 hover:scale-105"
        >
          {entry ? 'Update' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-gray-200 text-gray-700 p-2 rounded-md hover:bg-gray-300 transform transition-all duration-200 hover:scale-105"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EntryForm;