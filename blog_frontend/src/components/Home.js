import React, { useEffect, useState,useContext } from 'react';
import { getPosts,getUsers, deletePost } from '../services/api';
import PostCard from './PostCard';
import AuthContext from '../services/AuthContext';
import  PostContext  from '../services/PostContext';
import { Carousel } from 'react-bootstrap';

const Posts = () => {
    const { user } = useContext(AuthContext);
    const {fetchPosts,loading,searchResults}=useContext(PostContext)

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const fetchedPosts = await fetchPosts();
                setPosts(fetchedPosts);
            } catch (error) {
                console.error("Failed to fetch posts", error);
            }
        };
        loadPosts();
    }, [fetchPosts]);

    if (loading) return <div>Loading...</div>;

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

            {loading && <p>Loading...</p>}
            <div>
            {searchResults.posts.length > 0 && (
                    <>
                        <h2>Posts</h2>
                        {searchResults.posts.map(post => (
                            <div key={post.id}>
                                <h3>{post.title}</h3>
                                <p>{post.content}</p>
                            </div>
                        ))}
                    </>
            )}
            
            {searchResults.users.length > 0 && (
                    <>
                        <h2>Users</h2>
                        {searchResults.users.map(user => (
                            <div key={user.id}>
                                <h3>{user.username}</h3>
                                <p>{user.email}</p>
                            </div>
                        ))}
                    </>
                )}

                {/* Display message if no results found */}
                {searchResults.posts.length === 0 && searchResults.users.length === 0 && (
                    <p>No results found.</p>
                )}
            </div>
            

            <h1>Posts</h1>
            <div className="row row-cols-1 row-cols-md-4 g-4">
                {posts.map(post => (
                    <PostCard
                        key={post.id}
                        post={post} 
                    />
                ))}
            </div>

            
        </div>
    );
};

export default Posts;