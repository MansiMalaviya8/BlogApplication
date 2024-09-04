// src/App.js
import React, {useState} from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CreatePost from "./components/CreatePost";
import Home from "./components/Home";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Post from "./components/Post";
import  User  from "./components/User";
import SearchResults from './components/SearchResults'
import { AuthProvider } from "./services/AuthContext";
import { PostProvider } from "./services/PostContext";
import Register from "./components/Register";

const App = () => {

  const [key, setKey] = useState(0);

  const handleLogout = () => {
    // Perform any logout logic here
    setKey(prevKey => prevKey + 1); // Increment key to force re-render
  };

  return (
    <AuthProvider>
      <PostProvider>
        <Router>
          <Navbar onLogout={handleLogout} />
          <div className="container mt-4">
            <Routes key={key}>
              <Route path="/" element={<Home />} />

              <Route path="/create" element={<CreatePost />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/posts/:postId" element={<Post />} />
              <Route path="/users/:userId" element={<User />} />

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
