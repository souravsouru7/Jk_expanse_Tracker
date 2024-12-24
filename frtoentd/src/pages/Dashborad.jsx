import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slice/authSlice";
import {
  fetchMonthlyExpenses,
  fetchIncomeVsExpense,
  fetchCategoryExpenses,
} from "../store/slice/analyticsSlice";
import {
  fetchProjects,
  createProject,
  selectProject,
  deleteProject,
} from "../store/slice/projectSlice";
import { Menu, X, TrendingUp, Book, LogOut, DollarSign } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { TrashIcon } from "@heroicons/react/24/outline";

const ChartCard = ({ title, children }) => (
  <div className="bg-gray-800/90 p-6 rounded-xl shadow-lg">
    <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
    {children}
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [hoveredSection, setHoveredSection] = useState(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("");

  const user = useMemo(() => JSON.parse(localStorage.getItem("user")), []);
  const userId = user?._id || user?.id;

  const projects = useSelector((state) => state.projects.projects);
  const selectedProject = useSelector(
    (state) => state.projects.selectedProject
  );
  const monthlyExpenses = useSelector(
    (state) => state.analytics.monthlyExpenses
  );
  const incomeVsExpense = useSelector(
    (state) => state.analytics.incomeVsExpense
  );
  const categoryExpenses = useSelector(
    (state) => state.analytics.categoryExpenses
  );

  const colorPalette = useMemo(
    () => [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEEAD",
      "#D4A5A5",
      "#9B6B9E",
      "#77A6F7",
      "#FFBE0B",
      "#3EDBF0",
    ],
    []
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchProjects(userId));
    } else {
      navigate("/login");
    }
  }, [dispatch, userId, navigate]);

  useEffect(() => {
    if (selectedProject) {
      dispatch(
        fetchMonthlyExpenses({ userId, projectId: selectedProject._id })
      );
      dispatch(
        fetchIncomeVsExpense({ userId, projectId: selectedProject._id })
      );
      dispatch(
        fetchCategoryExpenses({ userId, projectId: selectedProject._id })
      );
    }
  }, [dispatch, userId, selectedProject]);

  const showToast = (message, type) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleCreateProject = () => {
    if (newProjectName) {
      dispatch(
        createProject({
          userId,
          name: newProjectName,
          description: newProjectDescription,
        })
      );
      setNewProjectName("");
      setNewProjectDescription("");
      showToast("Project created successfully", "success");
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this project? This will delete all associated entries."
      )
    ) {
      try {
        await dispatch(deleteProject({ projectId, userId })).unwrap();
        showToast("Project deleted successfully", "success");
      } catch (error) {
        showToast("Failed to delete project", "error");
      }
    }
  };

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

  const StatCard = useMemo(
    () =>
      ({ title, value, icon: Icon, color }) =>
        (
          <div
            className={`bg-gray-800/90 p-6 rounded-xl shadow-lg ${
              activeCard === title ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-gray-400 text-sm">{title}</h3>
                <p className="text-2xl font-semibold text-white mt-1">
                  {value}
                </p>
              </div>
              {Icon && (
                <div className={`p-3 rounded-full ${color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              )}
              {title === "Project" && (
                <button
                  onClick={() => handleDeleteProject(selectedProject._id)}
                  className="text-red-500 hover:text-red-400 ml-2"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ),
    [activeCard, handleDeleteProject, selectedProject]
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-600">
      {/* Notification Toast */}
      {showNotification && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            notificationType === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {notificationMessage}
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-gray-900/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-white text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500">
              JK ExpenseTracker
            </h1>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {["Entries", "Balance Sheet"].map((item) => (
                <button
                  key={item}
                  onClick={() =>
                    navigate(`/${item.toLowerCase().replace(" ", "-")}`)
                  }
                  className="relative text-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:text-white transition-colors duration-200"
                >
                  {item}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-transform duration-200 hover:scale-105"
              >
                Logout
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-300 hover:text-white transition-transform duration-200"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {["Entries", "Balance Sheet"].map((item) => (
                  <button
                    key={item}
                    onClick={() =>
                      navigate(`/${item.toLowerCase().replace(" ", "-")}`)
                    }
                    className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200"
                  >
                    {item}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left"
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
        <h1 className="text-4xl font-bold mb-8 text-white text-center">
          Welcome to Your Dashboard
        </h1>

        {/* Project Creation */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Create a New Project
          </h2>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Project Name"
              className="p-2 rounded-md border border-gray-700 bg-gray-800 text-white"
            />
            <input
              type="text"
              value={newProjectDescription}
              onChange={(e) => setNewProjectDescription(e.target.value)}
              placeholder="Project Description"
              className="p-2 rounded-md border border-gray-700 bg-gray-800 text-white"
            />
            <button
              onClick={handleCreateProject}
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-transform duration-200 hover:scale-105"
            >
              Create Project
            </button>
          </div>
        </div>

        {/* Project Selection */}
        {/* Project Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Select a Project
          </h2>
          <div className="flex flex-wrap gap-4">
            {projects.map((project) => (
              <div key={project._id} className="flex items-center">
                <button
                  onClick={() => dispatch(selectProject(project))}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105
                        ${
                          selectedProject?._id === project._id
                            ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                            : "bg-gray-800 text-gray-300"
                        }`}
                >
                  {project.name}
                </button>
                <button
                  onClick={() => handleDeleteProject(project._id)}
                  className="text-red-500 hover:text-red-400 ml-2"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Charts */}
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
                  <linearGradient
                    id="colorGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.3} />
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
                      fill={entry._id === "Income" ? "#4ADE80" : "#F87171"}
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

      {/* Custom Notification Component */}
      {showNotification && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg transition-opacity duration-300 ${
            notificationType === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          <div className="flex items-center">
            <span className="mr-2">
              {notificationType === "success" ? "✓" : "✕"}
            </span>
            {notificationMessage}
          </div>
        </div>
      )}
    </div>
  );
};

// PropTypes for ChartCard component

// Memoize the Dashboard component to prevent unnecessary re-renders
export default React.memo(Dashboard);
