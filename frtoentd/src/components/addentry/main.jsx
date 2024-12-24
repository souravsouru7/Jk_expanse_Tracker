import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addEntry, updateEntry, fetchEntries, deleteEntry } from '../../store/slice/entrySlice';
import { Plus, Search, Filter, X } from 'lucide-react';
import EntryForm from './EntryForm';

const ExpenseTracker = () => {
  const dispatch = useDispatch();
  const { entries, status, error } = useSelector((state) => state.entries);
  const selectedProject = useSelector((state) => state.projects.selectedProject);
  const [showForm, setShowForm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    type: 'All',
    category: 'All',
    dateRange: 'All'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    dispatch(fetchEntries());
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch]);

  useEffect(() => {
    if (selectedProject) {
      dispatch(fetchEntries());
    }
  }, [dispatch, selectedProject?._id]);

  if (!selectedProject) {
    return (
      <div className="min-h-screen bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-gray-900 via-purple-900 to-violet-600 flex items-center justify-center">
        <div className="text-center p-8 bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Select a Project</h2>
          <p className="text-gray-300">Please select a project from the dashboard to view its entries.</p>
        </div>
      </div>
    );
  }

  const getFilteredEntries = () => {
    return entries.filter(entry => {
      const matchesSearch = 
        entry.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.amount.toString().includes(searchTerm);
      
      const matchesType = activeFilters.type === 'All' || entry.type === activeFilters.type;
      const matchesCategory = activeFilters.category === 'All' || entry.category === activeFilters.category;
      
      let matchesDate = true;
      const entryDate = new Date(entry.date);
      const today = new Date();
      
      switch (activeFilters.dateRange) {
        case 'Today':
          matchesDate = entryDate.toDateString() === today.toDateString();
          break;
        case 'This Week':
          const weekAgo = new Date(today.setDate(today.getDate() - 7));
          matchesDate = entryDate >= weekAgo;
          break;
        case 'This Month':
          matchesDate = 
            entryDate.getMonth() === today.getMonth() &&
            entryDate.getFullYear() === today.getFullYear();
          break;
        default:
          matchesDate = true;
      }

      return matchesSearch && matchesType && matchesCategory && matchesDate;
    });
  };

  const categories = ['All', ...new Set(entries.map(entry => entry.category))];

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      dispatch(deleteEntry(id));
    }
  };

  return (
    <div className="min-h-screen bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-gray-900 via-purple-900 to-violet-600 py-8 relative">
      <div className="max-w-4xl mx-auto p-6 space-y-6 relative z-10">
        {/* Header */}
        <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900/50 backdrop-blur-md border-b border-gray-700' : ''}`}>
          <div className="max-w-4xl mx-auto p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h1 className="text-3xl font-bold animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">
             Jk Expense Tracker
              <span className="block text-sm font-normal text-gray-300 mt-1">Track your expenses and income efficiently</span>
            </h1>
            <button
              onClick={() => setShowForm(true)}
              className="group flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Plus size={20} className="transform group-hover:rotate-180 transition-transform duration-300" />
              <span>Add Entry</span>
            </button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mt-24 bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-xl shadow-lg p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-purple-500 transition-colors duration-200" size={20} />
              <input
                type="text"
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg hover:bg-gray-700/50 transition-colors duration-200 text-white group"
            >
              <Filter size={20} className="text-gray-400 group-hover:text-purple-500 transition-colors duration-200" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">Type</label>
                <select
                  value={activeFilters.type}
                  onChange={(e) => setActiveFilters(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-2 mt-1 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                >
                  <option value="All">All</option>
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Category</label>
                <select
                  value={activeFilters.category}
                  onChange={(e) => setActiveFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 mt-1 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Date Range</label>
                <select
                  value={activeFilters.dateRange}
                  onChange={(e) => setActiveFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                  className="w-full p-2 mt-1 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                >
                  <option value="All">All Time</option>
                  <option value="Today">Today</option>
                  <option value="This Week">This Week</option>
                  <option value="This Month">This Month</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Entries List */}
        <div className="bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-xl shadow-lg p-4">
          {status === 'loading' && (
            <div className="text-center py-4 text-gray-300">Loading entries...</div>
          )}
          {status === 'failed' && (
            <div className="text-center py-4 text-red-400">{error}</div>
          )}
          {status === 'succeeded' && (
            <div className="space-y-4">
              {getFilteredEntries().map((entry) => (
                <div key={entry._id} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 transition-all duration-200 hover:bg-gray-800/50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{entry.category}</h3>
                      <p className="text-sm text-gray-400">{entry.description}</p>
                      <p className="text-sm text-gray-400">{new Date(entry.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${entry.type === 'Income' ? 'text-green-400' : 'text-red-400'}`}>
                        {entry.type === 'Income' ? '+' : '-'}Rs{entry.amount.toFixed(2)}
                      </p>
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => {
                            setSelectedEntry(entry);
                            setShowForm(true);
                          }}
                          className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(entry._id)}
                          className="text-red-400 hover:text-red-300 transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <EntryForm
          entry={selectedEntry}
          onClose={() => {
            setShowForm(false);
            setSelectedEntry(null);
          }}
        />
      )}

      <style jsx>{`
        .animate-text {
          background-size: 200% auto;
          animation: textShine 3s linear infinite;
        }
        @keyframes textShine {
          to {
            background-position: 200% center;
          }
        }
      `}</style>
    </div>
  );
};

export default ExpenseTracker;