import React,{useContext} from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from 'lucide-react';
import styled from 'styled-components';
import AuthContext from '../services/AuthContext';

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

    .navbar-nav .nav-link:hover, .navbar-nav .nav-link.active {
        color: #fff; /* White text on hover and active */
        border-bottom: 2px solid #fff; /* White underline */
    }

    .navbar-nav .profile-icon {
        color: #fff; /* White icon */
        font-size: 1.5rem;
    }

    .auth-buttons {
        display: flex;
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
`;

const Navbar = () => {
    const location = useLocation();
    const { user, logout } = useContext(AuthContext);

    return (
        <NavbarWrapper className="navbar navbar-expand-lg">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">MyBlog</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === '/create' ? 'active' : ''}`} to="/create">Create Post</Link>
                        </li>
                    </ul>

                    <div className="auth-buttons">
                        {!user ? (<>
                            <Link className="btn" to="/login">Login</Link>
                            <Link className="btn" to="/register">Sign up</Link>
                        </>):(<>
                            <Link to="/profile">
                            <User className="profile-icon" />
                        </Link>
                        <Link className="btn"  onClick={logout}>Logout</Link>
                        </>)}
                        
                    </div>
                </div>
            </div>
        </NavbarWrapper>
    );
};

export default Navbar;
