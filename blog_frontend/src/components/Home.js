import React, { useEffect, useState,useContext } from 'react';
import { getPosts, deletePost } from '../services/api';
import PostCard from './PostCard';
import AuthContext from '../services/AuthContext';
import { Carousel } from 'react-bootstrap';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    // const [newPost, setNewPost] = useState({ title: '', content: '' });
    const { user } = useContext(AuthContext);

    useEffect(() => {
        getPosts().then(response => setPosts(response.data));
    }, []);

   

    const onDelete = async (id) => {
        await deletePost(id);
        setPosts(posts.filter(post => post.id !== id));
    };

    return (
        <div>
            <Carousel style={{ marginTop: '75px' }}>
    <Carousel.Item>
        <img
            className="d-block w-100"
            src="/passion.jpg"
            alt="First slide"
            height='600px'
            width='800px'
        />
        <Carousel.Caption>
            <h3>First Slide</h3>
            <p>Description for the first slide.</p>
        </Carousel.Caption>
    </Carousel.Item>

    <Carousel.Item>
        <img
            className="d-block w-100"
            src="/food.jpg"
            alt="Second slide"
            height='600px'
            width='800px'
        />
        <Carousel.Caption>
            <h3>Second Slide</h3>
            <p>Description for the second slide.</p>
        </Carousel.Caption>
    </Carousel.Item>

    <Carousel.Item>
        <img
            className="d-block w-100"
            src="/travel.jpg"
            alt="Third slide"
            height='600px'
            width='800px'
        />
        <Carousel.Caption>
            <h3>Third Slide</h3>
            <p>Description for the third slide.</p>
        </Carousel.Caption>
    </Carousel.Item>

    <Carousel.Item>
        <img
            className="d-block w-100"  // Consistent class with other slides
            src="/news.jpg"
            alt="Fourth slide"
            height='600px'
            width='800px'
        />
        <Carousel.Caption>
            <h3>Fourth Slide</h3>
            <p>Description for the fourth slide.</p>
        </Carousel.Caption>
    </Carousel.Item>
</Carousel>

            <h1>Posts</h1>
            <div className="row row-cols-1 row-cols-md-4 g-4">
                {posts.map(post => (
                    <PostCard
                        key={post.id}
                        post={post}
                        currentUser={user}
                        onDelete={onDelete}
                    />
                ))}
            </div>
            
        </div>
    );
};

export default Posts;