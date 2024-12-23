import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slice/authSlice';
import { fetchMonthlyExpenses, fetchIncomeVsExpense, fetchCategoryExpenses } from '../store/slice/analyticsSlice';
import { Menu, X, TrendingUp, Book, LogOut, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [activeCard, setActiveCard] = useState(null);
    const [hoveredSection, setHoveredSection] = useState(null);

    const user = useMemo(() => JSON.parse(localStorage.getItem('user')), []);
    const userId = user?._id || user?.id;

    const monthlyExpenses = useSelector((state) => state.analytics.monthlyExpenses);
    const incomeVsExpense = useSelector((state) => state.analytics.incomeVsExpense);
    const categoryExpenses = useSelector((state) => state.analytics.categoryExpenses);

    const colorPalette = useMemo(() => [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
        '#D4A5A5', '#9B6B9E', '#77A6F7', '#FFBE0B', '#3EDBF0'
    ], []);

    useEffect(() => {
        if (userId && (!monthlyExpenses.length || !incomeVsExpense.length || !categoryExpenses.length)) {
            dispatch(fetchMonthlyExpenses(userId));
            dispatch(fetchIncomeVsExpense(userId));
            dispatch(fetchCategoryExpenses(userId));
        } else if (!userId) {
            navigate('/login');
        }
    }, [dispatch, userId, navigate, monthlyExpenses.length, incomeVsExpense.length, categoryExpenses.length]);

    const CustomTooltip = useMemo(() => {
        return ({ active, payload, label }) => {
            if (active && payload && payload.length) {
                return (
                    <div className="bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-700">
                        <p className="text-gray-200 font-semibold">{`${label}`}</p>
                        {payload.map((entry, index) => (
                            <p key={index} className="text-gray-300">
                                {`${entry.name}: $${entry.value.toLocaleString()}`}
                            </p>
                        ))}
                    </div>
                );
            }
            return null;
        };
    }, []);

    const StatCard = useMemo(() => {
        return ({ title, icon: Icon, onClick, bgColor, stats }) => (
            <div
                className={`transform perspective-1000 transition-all duration-300 hover:scale-105 cursor-pointer`}
                onClick={onClick}
                onMouseEnter={() => setActiveCard(title)}
                onMouseLeave={() => setActiveCard(null)}
            >
                <div className={`${bgColor} p-6 rounded-xl shadow-lg backdrop-blur-lg transform transition-all duration-300 hover:shadow-2xl 
                               ${activeCard === title ? 'rotate-y-10' : ''}`}>
                    <div className="flex items-center space-x-4">
                        <div className="bg-white/20 p-3 rounded-lg transform transition-all duration-300 hover:rotate-12">
                            <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">{title}</h3>
                    </div>
                    {stats && (
                        <div className="mt-4 text-white/90">
                            <p className="text-sm">{stats}</p>
                        </div>
                    )}
                    <div className="mt-4 h-1 bg-white/30 rounded-full overflow-hidden">
                        <div 
                            className={`h-full bg-white transition-all duration-500 ${
                                activeCard === title ? 'w-full' : 'w-0'
                            }`}
                        />
                    </div>
                </div>
            </div>
        );
    }, [activeCard]);

    const ChartCard = useMemo(() => {
        return ({ title, children }) => (
            <div 
                className={`bg-gray-800/90 p-6 rounded-xl shadow-lg backdrop-blur-md border border-gray-700
                          transform transition-all duration-300 hover:shadow-2xl
                          ${hoveredSection === title ? 'scale-105' : 'scale-100'}`}
                onMouseEnter={() => setHoveredSection(title)}
                onMouseLeave={() => setHoveredSection(null)}
            >
                <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
                {children}
            </div>
        );
    }, [hoveredSection]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-gray-900 via-purple-900 to-violet-600">
            {/* Navbar */}
            <nav className="bg-gray-900/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-white text-2xl font-bold animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">
                            JK ExpenseTracker
                        </h1>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-4">
                            {['Entries', 'Balance Sheet'].map((item) => (
                                <button 
                                    key={item}
                                    onClick={() => navigate(`/${item.toLowerCase().replace(' ', '-')}`)}
                                    className="relative text-gray-300 px-4 py-2 rounded-md text-sm font-medium group"
                                >
                                    <span className="relative z-10">{item}</span>
                                    <div className="absolute inset-0 h-full w-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md -z-0 group-hover:w-full transition-all duration-300"/>
                                </button>
                            ))}
                            <button 
                                onClick={handleLogout}
                                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-md text-sm font-medium
                                         transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                            >
                                Logout
                            </button>
                        </div>

                        {/* Mobile menu button */}
                        <button 
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden text-gray-300 hover:text-white transform transition-all duration-300 hover:rotate-180"
                        >
                            {isOpen ? <X /> : <Menu />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {isOpen && (
                        <div className="md:hidden animate-slideDown">
                            <div className="px-2 pt-2 pb-3 space-y-1">
                                {['Entries', 'Balance Sheet'].map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => navigate(`/${item.toLowerCase().replace(' ', '-')}`)}
                                        className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left
                                                 transform transition-all duration-300 hover:translate-x-2"
                                    >
                                        {item}
                                    </button>
                                ))}
                                <button
                                    onClick={handleLogout}
                                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left
                                             transform transition-all duration-300 hover:translate-x-2"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-8 text-white text-center animate-fadeIn">
                    Welcome to Your Dashboard
                </h1>
                
                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    <StatCard 
                        title="Entries"
                        icon={Book}
                        onClick={() => navigate('/entries')}
                        bgColor="bg-gradient-to-br from-blue-500 to-cyan-500"
                        stats="Track your daily transactions"
                    />
                    
                    <StatCard 
                        title="Balance Sheet"
                        icon={TrendingUp}
                        onClick={() => navigate('/balance-sheet')}
                        bgColor="bg-gradient-to-br from-emerald-500 to-teal-500"
                        stats="View your financial summary"
                    />

                    <StatCard 
                        title="Analytics"
                        icon={DollarSign}
                        onClick={() => setHoveredSection('Monthly Expenses')}
                        bgColor="bg-gradient-to-br from-purple-500 to-pink-500"
                        stats="Analyze your spending patterns"
                    />
                </div>

                {/* Graphs */}
                <div className="mt-12 grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    <ChartCard title="Monthly Expenses Breakdown">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlyExpenses}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="_id.month" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar dataKey="total" fill="url(#colorGradient)">
                                    {monthlyExpenses.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={colorPalette[index % colorPalette.length]} 
                                        />
                                    ))}
                                </Bar>
                                <defs>
                                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.3}/>
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <ChartCard title="Income vs Expense Comparison">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={incomeVsExpense}
                                    dataKey="total"
                                    nameKey="_id"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label
                                >
                                    {incomeVsExpense.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={entry._id === 'Income' ? '#4ADE80' : '#F87171'}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <ChartCard title="Category-wise Expense Distribution">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryExpenses}
                                    dataKey="total"
                                    nameKey="_id"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label
                                >
                                    {categoryExpenses.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={colorPalette[index % colorPalette.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>
            </div>

            <style jsx>{`
                @keyframes rotate-y-10 {
                    from { transform: rotateY(0deg); }
                    to { transform: rotateY(10deg); }
                }
                .rotate-y-10 {
                    animation: rotate-y-10 0.3s ease-out forwards;
                }
                .animate-text {
                    background-size: 200% auto;
                    animation: textShine 3s linear infinite;
                }
                @keyframes textShine {
                    to {
                        background-position: 200% center;
                    }
                }
                .animate-slideDown {
                    animation: slideDown 0.3s ease-out forwards;
                }
                @keyframes slideDown {
                    from { transform: translateY(-10px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default React.memo(Dashboard);