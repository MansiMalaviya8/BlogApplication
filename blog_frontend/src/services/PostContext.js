import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
const PostContext = createContext();

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [postById, setPostById] = useState(null); // Add state for single post

    const createPost = async (postData) => {
        try {
            // const dataWithUserId={...postData, user_id: userId}
            const response = await axios.post('http://127.0.0.1:8000/api/post/create/', postData, {
               
            });
            return response.data;
        } catch (error) {
            setError('Error creating post');
            throw error;
        }
    };

    // Fetch posts
    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/posts/');
            setPosts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setLoading(false);
        }
    };

    const fetchPostById = async (id) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/posts/${id}/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching post by ID:', error);
            throw new Error('Error fetching post');
        }
    };

    // Like a post
    const likePost = async (postId, userId) => {
        try {

            const response = await axios.post('http://127.0.0.1:8000/api/posts/like/', { post_id: postId, user_id: userId }, {
                // headers: {
                //     'Authorization': Token ${localStorage.getItem('token')}, // Adjust this if you're using a different auth mechanism
                // }
            });
            fetchPosts()
            // Update the posts state after liking a post
            // setPosts(posts.map(post => 
            //     post.id === postId ? { ...post, liked: true } : post
            // ));
            return response.data;
        } catch (error) {
            console.error('Error liking post', error);
            throw error;
        }
    };

    // Add a comment to a post
    const addComment = async (postId, content) => {
        try {
            await axios.post('http://127.0.0.1:8000/api/comments/', { post: postId, content });
            fetchPosts(); // Refresh posts after adding a comment
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <PostContext.Provider value={{ posts,postById, loading, likePost, addComment,createPost,fetchPostById }}>
            {children}
        </PostContext.Provider>
    );
};

export default PostContext;
