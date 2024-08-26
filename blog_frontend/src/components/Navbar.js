import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { User, Search } from "lucide-react"; // Import the Search icon
import styled from "styled-components";
import AuthContext from "../services/AuthContext";
import PostContext from "../services/PostContext";

import { useNavigate } from "react-router-dom";

const NavbarWrapper = styled.nav`
  background-color: #000; /* Black background */
  padding: 10px 20px;

  .navbar-brand {
    color: #fff; /* White text */
    font-size: 1.5rem;
    font-weight: bold;
  }

  .navbar-nav .nav-link {
    color: #ccc; /* Light grey text */
    margin-right: 20px;
    font-size: 1rem;
    transition: color 0.3s ease;
  }

  .navbar-nav .nav-link:hover,
  .navbar-nav .nav-link.active {
    color: #fff; /* White text on hover and active */
    border-bottom: 2px solid #fff; /* White underline */
  }

  .navbar-nav .profile-icon {
    color: #fff; /* White icon */
    font-size: 1.5rem;
  }

  .auth-buttons {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .btn {
    color: #fff; /* White text */
    background-color: #333; /* Dark grey background */
    border: none;
    padding: 5px 15px;
    border-radius: 20px;
    font-size: 0.9rem;
    transition: background-color 0.3s ease;
  }

  .btn:hover {
    background-color: #555; /* Slightly lighter grey on hover */
  }

  .dropdown-menu {
    background-color: #333; /* Dark grey background */
  }

  .dropdown-item {
    color: #ccc; /* Light grey text */
  }

  .dropdown-item:hover {
    background-color: #555; /* Slightly lighter grey on hover */
    color: #fff; /* White text */
  }

  .search-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  .search-container input {
    padding: 5px 30px 5px 10px;
    border-radius: 20px;
    border: 1px solid #ccc;
    background-color: #222; /* Dark background for input */
    color: #fff; /* White text */
  }

  .search-container .search-icon {
    position: absolute;
    right: 10px;
    color: #fff; /* White icon */
  }
`;

const Navbar = () => {
  const { logout, fetchUser } = useContext(AuthContext);
  const navigation = useNavigate();
  const location = useLocation();

  const user = localStorage.getItem("accessToken");

  const [query, setQuery] = useState("");
  const { searchPosts, searchResults, loading } = useContext(PostContext);

  useEffect(() => {
    if (query.length > 2) {
        navigation(`/search?q=${query}`);
    }
}, [query,navigation]);

  const handleLogout = async () => {
    await logout();
    await navigation("/");
  };

  return (
    <NavbarWrapper className="navbar navbar-expand-lg fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          MyBlog
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/" ? "active" : ""
                }`}
                to="/"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/create" ? "active" : ""
                }`}
                to="/create"
              >
                Create Post
              </Link>
            </li>
            {/* Dropdown for Categories */}
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                to="#"
                id="categoryDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Categories
              </Link>
              <ul className="dropdown-menu" aria-labelledby="categoryDropdown">
                <li>
                  <Link className="dropdown-item" to="/category/food">
                    Food
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/category/travel">
                    Travel
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/category/fashion">
                    Fashion
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/category/news">
                    News
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/category/other">
                    Other
                  </Link>
                </li>
              </ul>
            </li>
          </ul>

          <div className="auth-buttons">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Search className="search-icon" size={18} />
            </div>
            {!user ? (
              <>
                <Link className="btn" to="/login">
                  Login
                </Link>
                <Link className="btn" to="/register">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                <Link to="/profile">
                  <User className="profile-icon" />
                </Link>

                <button className="btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </NavbarWrapper>
  );
};

export default Navbar;
