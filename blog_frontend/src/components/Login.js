// src/components/Login.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUser, login } from '../services/AuthAPI'; // Import the fetchUser function

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is already logged in
        const checkUserLoggedIn = async () => {
            try {
                const user = await fetchUser();
                if (user) {
                    // User is logged in, redirect to home
                    navigate('/');
                }
            } catch (error) {
                // Handle error if necessary
                console.error('Error checking user status:', error);
            }
        };

        checkUserLoggedIn();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/');
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center">
            <div className="card p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%', marginTop: '-50px' }}>
                <h2 className="text-center mb-4">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            id="username"
                            className="form-control"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="form-group mb-4">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-dark w-100">Login</button>
                </form>
                <div className="text-center mt-3">
                    <p className="mb-0">Don't have an account?</p>
                    <a href="/register" className="btn btn-link">Sign Up</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
