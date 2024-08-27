import React, { createContext,useState,useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    

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

    const fetchUserById = async (id) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/users/${id}/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching post by ID:', error);
            throw new Error('Error fetching post by ID');
        }
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
            const response = await axios.post('http://127.0.0.1:8000/api/register/', { username, email, password});
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

    const editProfile = async (profilePhoto, id) => {
        if (!profilePhoto) {
            alert("Please select a photo to upload");
            return;
        }
    
        const formData = new FormData();
        formData.append('profile_photo', profilePhoto);
    
        try {
            const response = await axios.put(`http://localhost:8000/api/user-profile/${id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Profile photo uploaded successfully:', response.data);
        } catch (error) {
            console.error('Error uploading profile photo:', error);
        }
    };
    

    return (
        <AuthContext.Provider value={{user, fetchUser, isAuthenticated,login, logout, register, toggleFollow, fetchFollowCounts,editProfile,fetchUserById }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;