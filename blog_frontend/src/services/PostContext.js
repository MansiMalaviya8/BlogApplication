import React, { createContext,useEffect,useState } from 'react';
import axios from 'axios';

const PostContext = createContext();

export const PostProvider = ({ children }) => {

    const [searchResults, setSearchResults] = useState({ posts: [],users:[]});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPosts()
    }, []);

    const searchPosts = async (query) => {
        if (!query) return;

        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/search/', { params: { q: query } });
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        } finally {
            setLoading(false);
        }
    };


    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/posts/');
            return response.data;
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw new Error('Error fetching posts');
        }
    };

    const createPost = async (postData) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/post/create/', postData);
            return response.data;
        } catch (error) {
            console.error('Error creating post:', error);
            throw new Error('Error creating post');
        }
    };

    const fetchPostById = async (id) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/posts/${id}/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching post by ID:', error);
            throw new Error('Error fetching post by ID');
        }
    };

    const likePost = async (postId, userId) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/posts/like/', { post_id: postId, user_id: userId });
            return response.data;
        } catch (error) {
            console.error('Error liking post:', error);
            throw new Error('Error liking post');
        }
    };

    const fetchComments = async (postId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/posts/${postId}/comments/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching comments:', error);
            throw new Error('Error fetching comments');
        }
    };

    const addComment = async (postId, userId, content) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/comments/add/', { post_id: postId, user_id: userId, content });
            return response.data;
        } catch (error) {
            console.error('Error adding comment:', error);
            throw new Error('Error adding comment');
        }
    };

    return (
        <PostContext.Provider value={{loading, fetchPosts, createPost, fetchPostById, likePost, fetchComments, addComment,searchPosts,searchResults }}>
            {children}
        </PostContext.Provider>
    );
};

export default PostContext;