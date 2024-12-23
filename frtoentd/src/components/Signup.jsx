import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signup } from '../store/slice/authSlice';

const Signup = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, error } = useSelector((state) => state.auth);

    const validateForm = () => {
        const { password, confirmPassword } = formData;
        if (password !== confirmPassword) {
            return 'Passwords do not match';
        }
        if (password.length < 8 || !/\d/.test(password)) {
            return 'Password must be at least 8 characters long and contain at least one number';
        }
        return '';
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            alert(validationError);
            return;
        }
        const result = await dispatch(signup(formData));
        if (signup.fulfilled.match(result)) {
            navigate('/login');
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-600 via-violet-600 to-orange-500">
            {/* Enhanced animated background shapes */}
            <div className="absolute inset-0 z-0">
                <div className="absolute w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse -top-10 -left-10"></div>
                <div className="absolute w-96 h-96 bg-violet-500/30 rounded-full blur-3xl animate-pulse top-1/2 right-0"></div>
                <div className="absolute w-96 h-96 bg-amber-500/30 rounded-full blur-3xl animate-pulse bottom-0 left-1/2"></div>
            </div>

            {/* Enhanced 3D rotating elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-white/10 backdrop-blur-sm rounded-lg animate-float"
                        style={{
                            width: `${Math.max(40, Math.random() * 80)}px`,
                            height: `${Math.max(40, Math.random() * 80)}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `float ${12 + i * 2}s infinite`,
                            transform: `rotate(${i * 45}deg) translateZ(${i * 15}px)`,
                            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
                        }}
                    ></div>
                ))}
            </div>

            {/* Additional geometric shapes */}
            <div className="absolute inset-0 z-0">
                <div className="absolute w-32 h-32 border-4 border-white/20 rounded-full top-20 right-20 animate-spin-slow"></div>
                <div className="absolute w-24 h-24 border-4 border-white/20 transform rotate-45 bottom-20 left-20 animate-bounce-slow"></div>
            </div>

            <div className="relative flex flex-col items-center justify-center min-h-screen">
                {/* App Name with enhanced styling */}
                <div className="mb-8 transform hover:scale-105 transition-all duration-300">
                    <h1 className="text-5xl font-bold text-white text-center animate-fade-in tracking-wide">
                        JK ExpenseTracker
                    </h1>
                    <div className="h-1 w-32 bg-gradient-to-r from-cyan-400 via-violet-400 to-amber-400 mx-auto mt-2 rounded-full"></div>
                </div>

                <div className="w-96 p-8 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300">
                    <h2 className="text-3xl font-bold mb-6 text-white text-center animate-fade-in">Create Account</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-white text-sm font-medium">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300"
                                required
                                placeholder="Enter your username"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-white text-sm font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300"
                                required
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-white text-sm font-medium">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300"
                                required
                                placeholder="Enter your password"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-white text-sm font-medium">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300"
                                required
                                placeholder="Confirm your password"
                            />
                        </div>
                        
                        {error && <p className="text-red-300 text-center animate-shake">{error}</p>}
                        
                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-blue-500 via-violet-500 to-amber-500 text-white rounded-lg font-medium transform hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Creating Account...
                                </span>
                            ) : (
                                'Sign Up'
                            )}
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <p className="text-white">Already have an account? <button onClick={() => navigate('/login')} className="text-amber-400 hover:underline">Login</button></p>
                    </div>
                </div>
            </div>
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-float {
                    animation: float 10s infinite ease-in-out;
                }
                .animate-shake {
                    animation: shake 0.5s infinite;
                }
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-in;
                }
                .animate-spin-slow {
                    animation: spin 15s linear infinite;
                }
                .animate-bounce-slow {
                    animation: bounce 3s infinite;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0) rotate(45deg); }
                    50% { transform: translateY(-20px) rotate(45deg); }
                }
            `}</style>
        </div>
    );
};

export default Signup;