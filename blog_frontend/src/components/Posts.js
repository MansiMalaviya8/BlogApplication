import React, { useEffect, useState } from 'react';
import { getPosts, createPost, deletePost } from '../services/api';
import PostCard from './PostCard';

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
            <div className="row row-cols-1 row-cols-md-4 g-4">
                {posts.map(post => (
                    <PostCard
                        key={post.id}
                        title={post.title}
                        content={post.content}
                        createdAt={post.created_at}
                        onDelete={() => onDelete(post.id)}
                    />
                ))}
            </div>
            
        </div>
    );
};

export default Posts;
