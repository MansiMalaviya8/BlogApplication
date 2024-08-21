// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Posts from './components/Posts';
import CreatePost from './components/CreatePost';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import { AuthProvider } from './components/AuthContext';
const App = () => {
    return (
        <AuthProvider>
        <Router>
            <Navbar />
            <div className="container mt-4">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/create" element={<CreatePost />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                </Routes>
            </div>
        </Router>
        </AuthProvider>
    );
};

export default App;
