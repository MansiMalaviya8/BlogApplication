// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CreatePost from "./components/CreatePost";
import Home from "./components/Home";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Post from "./components/Post";
import SearchResults from './components/SearchResults'
import { AuthProvider } from "./services/AuthContext";
import { PostProvider } from "./services/PostContext";
import Register from "./components/Register";

const App = () => {
  return (
    <AuthProvider>
      <PostProvider>
        <Router>
          <Navbar />
          <div className="container mt-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<CreatePost />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/posts/:postId" element={<Post />} />
              <Route path="/search" element={<SearchResults />} />

            </Routes>
          </div>
        </Router>
        <Footer />
      </PostProvider>
    </AuthProvider>
  );
};

export default App;
