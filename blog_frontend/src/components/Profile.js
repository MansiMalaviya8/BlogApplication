import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import AuthContext from '../services/AuthContext';
import PostContext from '../services/PostContext';

const Profile = () => {
    const { fetchUser, fetchFollowCounts } = useContext(AuthContext);
    const { posts } = useContext(PostContext);
    const [followCounts, setFollowCounts] = useState({ follower_count: 0, following_count: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    // Calculate the number of posts created by the current user
    const postCount = posts.filter(post => post.created_by === (user?.id || 0)).length;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await fetchUser();
                if (userData) {
                    setUser(userData);
                    const counts = await fetchFollowCounts(userData.id);
                    setFollowCounts(counts);
                }
            } catch (err) {
                setError('Failed to load user data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    },[]);

        if (loading) return <p>Loading...</p>;
        if (error) return <p>{error}</p>;
        if (!user) return <p>No user found</p>;

    return (
        <Container className="mt-5">
            <Row className="align-items-center">
                <Col xs={4} md={3}>
                    <Image 
                        src="/default_profile.jpeg" 
                        roundedCircle 
                        className="img-fluid" 
                        alt="User Avatar"
                    />
                </Col>
                <Col xs={8} md={9}>
                    <h3>{user.username}</h3>
                    <div className="d-flex justify-content-start">
                        <div className="me-4">
                            <strong>{postCount}</strong> Posts
                        </div>
                        <div className="me-4">
                            <strong>{followCounts.follower_count}</strong> Followers
                        </div>
                        <div className="me-4">
                            <strong>{followCounts.following_count}</strong> Following
                        </div>
                    </div>
                    <Button variant="outline-dark" className="mt-3">Edit Profile</Button>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col xs={12}>
                    <h5>Posts</h5>
                    <p>No posts available.</p>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;