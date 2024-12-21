
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageWrapper from './loading/PageWrapper';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './pages/Dashborad';

function App() {
    return (
        <Router>
            <Routes>
            <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
            <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
