import React, { useState } from 'react';
import { createPost } from '../services/api';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
    const [newPost, setNewPost] = useState({ title: '', content: '', likes: 0, comments: [] });
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
        <div className="container mt-5 pt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg border-0">
                        <div className="card-header bg-dark text-white text-center rounded-top">
                            <h2 className="mb-0">Create a New Blog Post</h2>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="title" className="form-label fs-5">Title</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        id="title"
                                        value={newPost.title}
                                        onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                                        placeholder="Enter your post title"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="content" className="form-label fs-5">Content</label>
                                    <textarea
                                        className="form-control form-control-lg"
                                        id="content"
                                        rows="6"
                                        value={newPost.content}
                                        onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                                        placeholder="Write your post content here"
                                        required
                                    />
                                </div>
                                <div className="d-flex justify-content-center">
                                    <button type="submit" className="btn btn-dark btn-lg px-5">
                                        Create Post
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;




