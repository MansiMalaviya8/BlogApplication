import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

// Define API base URL
const BASE_URL = 'http://127.0.0.1:8000/api/';

// Fetch user data
export const fetchUser = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            const response = await axios.get(`${BASE_URL}user/${decodedToken.user_id}/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user data:', error);
            localStorage.removeItem('accessToken');
            throw new Error('Error fetching user data');
        }
    }
    return null;
};

export const fetchUserById = async (id) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/users/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching post by ID:', error);
        throw new Error('Error fetching post by ID');
    }
};

export const toggleFollow = async (userId, currentUserId) => {
    try {
        const response = await axios.post('http://localhost:8000/api/toggle-follow/', { user_id: userId, following_user_id: currentUserId });
        return response.data;
    } catch (error) {
        console.error('Error toggling follow:', error);
        throw new Error('Error toggling follow');
    }
};

// Fetch follow counts
export const fetchFollowCounts = async (userId) => {
    try {
        const response = await axios.get(`http://localhost:8000/api/get-follow-counts/${userId}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching follow counts:', error);
        throw new Error('Error fetching follow counts');
    }
};

// Edit profile photo
export const editProfile = async (profilePhoto, userId) => {
    if (!profilePhoto) {
        alert("Please select a photo to upload");
        return;
    }

    const formData = new FormData();
    formData.append('profile_photo', profilePhoto);

    try {
        const response = await axios.put(`http://localhost:8000/api/user-profile/${userId}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading profile photo:', error);
        throw new Error('Error uploading profile photo');
    }
};

