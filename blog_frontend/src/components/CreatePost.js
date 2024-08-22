// src/components/CreatePost.js
import React, { useState } from 'react';
import { createPost } from '../services/api';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
    const [newPost, setNewPost] = useState({ title: '', content: '',likes:0,comments:[] });
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createPost(newPost);
            alert('Post created successfully!');
            setNewPost({ title: '', content: '' });
            navigate('/');
        } catch (error) {
            alert('Error creating post');
        }
    };

    return (
        <div className="container mt-4">
            <h1>Create a New Blog Post</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        value={newPost.title}
                        onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                        placeholder="Title"
                        required
                    />
                </div>
                <div className="mb-3">
                    <textarea
                        className="form-control"
                        value={newPost.content}
                        onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                        placeholder="Content"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Create Post</button>
            </form>
        </div>
    );
};

export default CreatePost;
