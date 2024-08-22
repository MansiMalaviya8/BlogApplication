import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const decodedToken = jwtDecode(token);
            setUser(decodedToken);
        }
    }, []);

    const login = async (username, password) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login/', { username, password });
            const { access } = response.data;
            localStorage.setItem('accessToken', access);
            const decodedToken = jwtDecode(access);
            setUser(decodedToken);
        } catch (error) {
            console.error(error);
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        setUser(null);
    };

    const register = async (username, email, password) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/register/', { username, email, password });
            return response.data;
        } catch (error) {
            throw new Error('Registration failed');
        }
    };


    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;