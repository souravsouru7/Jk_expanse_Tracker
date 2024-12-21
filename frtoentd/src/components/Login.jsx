import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import useAuthStore from '../store/authStore';
import { Mail, Lock, ArrowRight, Home } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const setToken = useAuthStore((state) => state.setToken);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await login(formData);
            setToken(response.data.token);
            setTimeout(() => {
                navigate('/dashboard');
            }, 500);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* 3D Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="cube absolute"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            opacity: 0.1
                        }}
                    />
                ))}
            </div>

            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="max-w-md w-full backdrop-blur-lg bg-white/90 rounded-2xl shadow-2xl transform transition-all duration-300 hover:shadow-3xl">
                    <div className="p-8">
                        <div className="text-center mb-8 animate-fade-in">
                            {/* Logo and Company Name */}
                            <div className="relative h-24 w-24 mx-auto mb-4">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl transform rotate-6 transition-transform group-hover:rotate-12" />
                                <div className="relative h-full w-full bg-white rounded-xl flex items-center justify-center">
                                    <Home className="text-blue-600" size={40} />
                                </div>
                            </div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                J.K. Expanse Tracker
                            </h1>
                            <p className="text-gray-600 mt-2">Transform your space with us</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative group animate-slide-up" style={{ animationDelay: '200ms' }}>
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-blue-600" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 group-hover:border-blue-500"
                                    required
                                />
                            </div>

                            <div className="relative group animate-slide-up" style={{ animationDelay: '400ms' }}>
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-blue-600" size={20} />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 group-hover:border-blue-500"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-between text-sm animate-slide-up" style={{ animationDelay: '600ms' }}>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 border border-gray-300 rounded focus:ring-blue-500" />
                                    <span className="text-gray-600">Remember me</span>
                                </label>
                                <a href="#forgot" className="text-blue-600 hover:text-blue-700 transition-colors duration-200">
                                    Forgot password?
                                </a>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-medium relative overflow-hidden transform transition-all duration-200 hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 animate-slide-up group"
                                style={{ animationDelay: '800ms' }}
                            >
                                <span className="relative flex items-center justify-center gap-2">
                                    {isLoading ? (
                                        <div className="w-6 h-6 border-t-2 border-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Sign In
                                            <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" size={20} />
                                        </>
                                    )}
                                </span>
                            </button>
                        </form>

                        {error && (
                            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm animate-shake">
                                <p className="flex items-center gap-2">
                                    <span className="flex-shrink-0">⚠️</span>
                                    {error}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0); }
                    50% { transform: translateY(-20px) rotate(10deg); }
                }
                .cube {
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(45deg, #4f46e5, #7c3aed);
                    animation: float 6s ease-in-out infinite;
                    transform-style: preserve-3d;
                    border-radius: 8px;
                }
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out forwards;
                }
                .animate-slide-up {
                    opacity: 0;
                    animation: slide-up 0.6s ease-out forwards;
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default Login;