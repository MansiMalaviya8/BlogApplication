import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const response = await axios.get(`http://127.0.0.1:8000/api/user/${decodedToken.user_id}/`, {
                    // headers: { Authorization: Bearer ${token} }
                });
                return response.data; // Return user data
            } catch (error) {
                console.error('Error fetching user data:', error);
                localStorage.removeItem('accessToken');
                throw error; // Propagate error
            }
        }
        return null; // Return null if no token
    };

    const toggleFollow = async (userId, currentUserId) => {
        try {
            const response = await axios.post(
                'http://localhost:8000/api/toggle-follow/', // Update with your actual API URL
                { user_id: userId, following_user_id: currentUserId },
                {
                    headers: {
                        // 'Authorization': Bearer ${authToken},
                        'Content-Type': 'application/json',
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error toggling follow:', error.response?.data || error.message);
            throw error; // Re-throw or handle error as needed
        }
    };

    const login = async (username, password) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login/', { username, password });
            const { access } = response.data;
            localStorage.setItem('accessToken', access);
            const decodedToken = jwtDecode(access);
            const userResponse = await axios.get(`http://127.0.0.1:8000/api/user/${decodedToken.user_id}/`, {
                // headers: { Authorization: `Bearer ${access}` }
            });
            setUser(userResponse.data);
        } catch (error) {
            console.error('Login failed:', error);
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


    // Method to fetch follow counts
    const fetchFollowCounts = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/get-follow-counts/${userId}/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching follow counts:', error.response?.data || error.message);
            throw error; // Handle error as needed
        }
    };


    return (
        <AuthContext.Provider value={{ user, login, logout, register,fetchUser,toggleFollow,fetchFollowCounts }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;