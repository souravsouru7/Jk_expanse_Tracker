import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addEntry, updateEntry, fetchEntries } from '../../store/slice/entrySlice';
import { Plus, Search, Filter, X, ArrowUp, ArrowDown } from 'lucide-react';

const ExpenseTracker = () => {
  const dispatch = useDispatch();
  const { entries, status, error } = useSelector((state) => state.entries);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Income',
    amount: '',
    category: '',
    description: ''
  });
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
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userId = JSON.parse(localStorage.getItem('user'))?.id;

    if (!userId) {
      alert('User ID not found. Please login again.');
      return;
    }

    const entryData = { ...formData, userId };

    if (selectedEntry) {
      dispatch(updateEntry({ id: selectedEntry._id, updates: entryData }));
    } else {
      dispatch(addEntry(entryData));
    }

    setShowForm(false);
    setFormData({ type: 'Income', amount: '', category: '', description: '' });
    setSelectedEntry(null);
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6 relative z-10">
        {/* Header */}
        <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-lg' : ''
        }`}>
          <div className="max-w-4xl mx-auto p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Financial Tracker
              <span className="block text-sm font-normal text-gray-500 mt-1">
                Track your expenses and income efficiently
              </span>
            </h1>
            <button
              onClick={() => setShowForm(true)}
              className="group flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transform transition-all duration-300 hover:scale-105 hover:rotate-1 shadow-lg hover:shadow-xl"
            >
              <Plus size={20} className="transform group-hover:rotate-180 transition-transform duration-300" />
              <span>Add Entry</span>
            </button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mt-24 bg-white/80 backdrop-blur-lg rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 transform hover:scale-[1.01] transition-transform">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" size={20} />
              <input
                type="text"
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-transparent backdrop-blur-sm transition-all duration-200"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-blue-50 transition-colors duration-200 group"
            >
              <Filter size={20} className="transform group-hover:rotate-180 transition-transform duration-300" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 border rounded-lg bg-white/50 backdrop-blur-sm space-y-4 transform origin-top transition-all duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Type', 'Category', 'Date Range'].map((filterType, index) => (
                  <div key={filterType} className="transform hover:scale-105 transition-transform duration-200"
                       style={{ animationDelay: `${index * 100}ms` }}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{filterType}</label>
                    <select
                      value={activeFilters[filterType.toLowerCase().replace(' ', '')]}
                      onChange={(e) => setActiveFilters({
                        ...activeFilters,
                        [filterType.toLowerCase().replace(' ', '')]: e.target.value
                      })}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200 hover:bg-white"
                    >
                      {filterType === 'Type' && ['All', 'Income', 'Expense'].map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                      {filterType === 'Category' && categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                      {filterType === 'Date Range' && ['All', 'Today', 'This Week', 'This Month'].map(range => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setActiveFilters({
                      type: 'All',
                      category: 'All',
                      dateRange: 'All'
                    });
                    setSearchTerm('');
                  }}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  <X size={16} className="transform hover:rotate-90 transition-transform duration-200" />
                  <span>Clear all filters</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Entry Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
               onClick={() => setShowForm(false)}>
            <div className="w-full max-w-md bg-white/90 backdrop-blur-lg rounded-xl shadow-2xl p-6 transform transition-all duration-300 hover:scale-[1.02]"
                 onClick={e => e.stopPropagation()}>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                {selectedEntry ? 'Edit Entry' : 'New Entry'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {['Type', 'Amount', 'Category', 'Description'].map((field, index) => (
                  <div key={field} className="space-y-2 transform transition-all duration-300"
                       style={{ animationDelay: `${index * 100}ms` }}>
                    <label className="block text-sm font-medium text-gray-700">{field}</label>
                    {field === 'Type' ? (
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:bg-blue-50"
                      >
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                      </select>
                    ) : (
                      <input
                        type={field === 'Amount' ? 'number' : 'text'}
                        value={formData[field.toLowerCase()]}
                        onChange={(e) => setFormData({ ...formData, [field.toLowerCase()]: e.target.value })}
                        required={field !== 'Description'}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:bg-blue-50"
                        placeholder={`Enter ${field.toLowerCase()}...`}
                      />
                    )}
                  </div>
                ))}

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transform transition-all duration-300 hover:scale-105 hover:rotate-1"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transform transition-all duration-300 hover:scale-105 hover:-rotate-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Entries List */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 transform hover:scale-[1.01] transition-transform duration-300">
          <h2 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Entries
          </h2>
          {status === 'loading' && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          {status === 'failed' && (
            <div className="text-red-500 text-center py-4">Error: {error}</div>
          )}
          {status === 'succeeded' && getFilteredEntries().length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-lg mb-2">No entries found</div>
              <p className="text-gray-500 text-sm">
                {searchTerm || activeFilters.type !== 'All' || activeFilters.category !== 'All' || activeFilters.dateRange !== 'All'
                  ? 'Try adjusting your filters or search terms'
                  : 'Start by adding your first entry'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {getFilteredEntries().map((entry, index) => (
                <div
                  key={entry._id}
                  className="group border rounded-lg p-4 hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-white/50 to-gray-50/50 backdrop-blur-sm hover:scale-[1.02] hover:rotate-1"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className={`relative transform transition-transform duration-300 group-hover:scale-110 ${
                        entry.type === 'Income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <div className={`absolute inset-0 rounded-full ${
                          entry.type === 'Income' ? 'bg-green-100' : 'bg-red-100'
                        } animate-ping opacity-75`}></div>
                        <div className={`relative inline-flex items-center justify-center w-8 h-8 rounded-full ${
                          entry.type === 'Income' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {entry.type === 'Income' ? (
                            <ArrowUp className="w-4 h-4 transform transition-transform duration-300 group-hover:-translate-y-1" />
                          ) : (
                            <ArrowDown className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-y-1" />
                          )}
                        </div>
                      </div>
                      <div className="transform transition-all duration-300 group-hover:translate-x-2">
                        <span className={`font-semibold text-lg ${
                          entry.type === 'Income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          ₹{parseFloat(entry.amount).toLocaleString('en-IN')}
                        </span>
                        <span className="block text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                          {entry.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-right transform transition-all duration-300 group-hover:-translate-x-2">
                      <span className="block text-sm text-gray-600 font-medium">
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      {entry.description && (
                        <p className="text-sm text-gray-500 mt-1 group-hover:text-gray-700 transition-colors duration-300">
                          {entry.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="fixed bottom-6 right-6 space-y-4">
        {['Income', 'Expense'].map((type) => {
          const totalAmount = entries
            .filter(entry => entry.type === type)
            .reduce((sum, entry) => sum + parseFloat(entry.amount), 0);
          
          return (
            <div
              key={type}
              className={`transform hover:scale-105 transition-all duration-300 p-4 rounded-lg shadow-lg backdrop-blur-sm cursor-default
                ${type === 'Income' ? 'bg-green-500/90 hover:bg-green-600/90' : 'bg-red-500/90 hover:bg-red-600/90'}`}
            >
              <div className="text-white">
                <span className="block text-sm font-medium">Total {type}</span>
                <span className="block text-lg font-bold">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scroll to top button */}
      {isScrolled && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 left-6 p-3 bg-blue-600/90 text-white rounded-full shadow-lg hover:bg-blue-700/90 transform hover:scale-110 transition-all duration-300 backdrop-blur-sm"
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default ExpenseTracker;