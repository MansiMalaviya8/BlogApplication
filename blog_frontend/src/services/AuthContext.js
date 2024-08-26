import React, { createContext,useState,useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchUser()
    }, []);

    const isAuthenticated = () => {
        const token=localStorage.getItem('accessToken');
        if (token) {
            return true}
        else{ return false}
       
    };

    const fetchUser = async () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const response = await axios.get(`http://127.0.0.1:8000/api/user/${decodedToken.user_id}/`);
                setUser(response.data)
                return response.data;
            } catch (error) {
                console.error('Error fetching user data:', error);
                localStorage.removeItem('accessToken');
                throw new Error('Error fetching user data');
            }
        }
        return null; // Return null if no token
    };

    const login = async (username, password) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login/', { username, password });
            const { access } = response.data;
            localStorage.setItem('accessToken', access);
            return await fetchUser();  // Fetch user data after logging in
        } catch (error) {
            console.error('Login failed:', error);
            throw new Error('Login failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        setUser(null)
        return null;  // Return null after logout
    };

    const register = async (username, email, password) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/register/', { username, email, password });
            return response.data;
        } catch (error) {
            console.error('Registration failed:', error);
            throw new Error('Registration failed');
        }
    };

    const toggleFollow = async (userId, currentUserId) => {
        try {
            const response = await axios.post('http://localhost:8000/api/toggle-follow/', { user_id: userId, following_user_id: currentUserId });
            return response.data;
        } catch (error) {
            console.error('Error toggling follow:', error);
            throw new Error('Error toggling follow');
        }
    };

    const fetchFollowCounts = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/get-follow-counts/${userId}/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching follow counts:', error);
            throw new Error('Error fetching follow counts');
        }
    };

    return (
        <AuthContext.Provider value={{user, fetchUser, isAuthenticated,login, logout, register, toggleFollow, fetchFollowCounts }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;