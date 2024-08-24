// src/components/Register.js
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../services/AuthContext';

const Signup = () => {
    const { register } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }
        try {
            const result = await register(username, email, password);
            setMessage(result.message || 'Registration successful');
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center">
            <div className="card p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%', marginTop: '-25px' }}>
                <h2 className="text-center mb-4">Register</h2>
                <form>
                    <div className="form-group mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            id="username"
                            className="form-control"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ color: 'grey' }} // Use Bootstrap's text color utility
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ color: 'grey' }} // Use Bootstrap's text color utility
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ color: 'grey' }} // Use Bootstrap's text color utility
                        />
                    </div>
                    <div className="form-group mb-4">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="form-control"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{ color: 'grey' }} // Use Bootstrap's text color utility
                        />
                    </div>
                    <button type="button" className="btn btn-dark w-100" onClick={handleRegister}>Register</button>
                    {message && <p className="mt-3 text-center text-danger">{message}</p>}
                </form>
                <p className="text-center mt-3">
                    Already signed up? <Link to="/login">Sign in here</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
