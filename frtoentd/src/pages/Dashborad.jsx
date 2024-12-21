import React from 'react';
import useAuthStore from '../store/authStore';

const Dashboard = () => {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    return (
        <div>
            <h1>Welcome to the Dashboard</h1>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default Dashboard;
