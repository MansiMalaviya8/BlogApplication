import React, { useEffect, useState } from 'react';
import { getPosts, createPost, deletePost } from '../services/api';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({ title: '', content: '' });

    useEffect(() => {
        getPosts().then(response => setPosts(response.data));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        createPost(newPost).then(response => {
            setPosts([...posts, response.data]);
            setNewPost({ title: '', content: '' });
        });
    };

    const onDelete = async (id) => {
        await deletePost(id);
        setPosts(posts.filter(post => post.id !== id));
    };

    return (
        <div>
            <h1>Posts</h1>
            <ul>
            {posts.map(post => (
                <li key={post.id}>
                    {post.title}
                    <button onClick={() => onDelete(post.id)}>Delete</button>
                </li>
            ))}
        </ul>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={newPost.title}
                    onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="Title"
                />
                <textarea
                    value={newPost.content}
                    onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Content"
                />
                <button type="submit">Create Post</button>
            </form>
        </div>
    );
};

export default Posts;
