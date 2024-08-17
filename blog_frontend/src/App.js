// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Posts from './components/Posts';
import CreatePost from './components/CreatePost';

const App = () => {
    return (
        <Router>
            <Navbar />
            <div className="container mt-4">
                <Routes>
                    <Route path="/" element={<Posts />} />
                    <Route path="/create" element={<CreatePost />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
