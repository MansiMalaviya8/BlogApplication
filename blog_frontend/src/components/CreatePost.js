import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import PostContext from '../services/PostContext';
import AuthContext from '../services/AuthContext';

const CreatePost = () => {
    const [newPost, setNewPost] = useState({ title: '', content: '', category: 'OTR', post_photo: null });
    const navigate = useNavigate();
    const { createPost } = useContext(PostContext);
    const { user } = useContext(AuthContext);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setNewPost({ ...newPost, [name]: files[0] });
        } else {
            setNewPost({ ...newPost, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', newPost.title);
            formData.append('content', newPost.content);
            formData.append('category', newPost.category);
            if (newPost.post_photo) {
                formData.append('post_photo', newPost.post_photo); // Make sure to append the file
            }
            formData.append('user_id', user.id); // Include user_id in FormData
    
            await createPost(formData);
            alert('Post created successfully!');
            setNewPost({ title: '', content: '', category: 'OTR', post_photo: null });
            navigate('/');
        } catch (error) {
            console.error('Error creating post:', error);
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
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="mb-4">
                                    <label htmlFor="title" className="form-label fs-5">Title</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        id="title"
                                        name="title"
                                        value={newPost.title}
                                        onChange={handleChange}
                                        placeholder="Enter your post title"
                                        required
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <label htmlFor="content" className="form-label fs-5">Content</label>
                                    <textarea
                                        className="form-control form-control-lg"
                                        id="content"
                                        name="content"
                                        rows="6"
                                        value={newPost.content}
                                        onChange={handleChange}
                                        placeholder="Write your post content here"
                                        required
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <label htmlFor="category" className="form-label fs-5">Category</label>
                                    <select
                                        className="form-select form-select-lg"
                                        id="category"
                                        name="category"
                                        value={newPost.category}
                                        onChange={handleChange}
                                    >
                                        <option value="POL">Politics</option>
                                        <option value="BOL">Bollywood</option>
                                        <option value="SPO">Sports</option>
                                        <option value="TEC">Technology</option>
                                        <option value="OTR">Others</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="post_photo" className="form-label fs-5">Post Photo</label>
                                    <input
                                        type="file"
                                        className="form-control form-control-lg"
                                        id="post_photo"
                                        name="post_photo"
                                        onChange={handleChange}
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

export default CreatePost;