import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Image, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import AuthContext from "../services/AuthContext";
import PostContext from "../services/PostContext";

const User = () => {
  const { userId } = useParams();

  const { fetchUserById, fetchFollowCounts } = useContext(AuthContext);
  const { fetchPosts } = useContext(PostContext);
  const [followCounts, setFollowCounts] = useState({
    follower_count: 0,
    following_count: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [postCount, setPostCount] = useState(0);


  const fetchData = async (userId) => {
    try {
      const userData=await fetchUserById(userId)
      setUser(userData)
      const fetchedPosts=await fetchPosts()

      if (userData) {
        setUser(userData);
        const counts = await fetchFollowCounts(userData.id);
        setFollowCounts(counts);
        const userPostsCount = fetchedPosts.filter(
          (post) => post.created_by === userData.id);
        setPostCount(userPostsCount.length);
        console.log(user)
      }
    } catch (err) {
      setError("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(userId);
  }, [userId]);

  
  if (loading)
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  if (error) return <p>{error}</p>;
  if (!user) return <p>No user found</p>;

  return (
    <Container className="mt-5">
      <Row className="align-items-center">
        <Col xs={4} md={3} className="position-relative">
        {user.profile_photo?(<Image
            src={user.profile_photo}
            roundedCircle
            className="img-fluid"
            alt="User Avatar"
          />):(
            <Image
            src={"default_profile.jpeg"}
            roundedCircle
            className="img-fluid"
            alt="User Avatar"
          />
          )}
          
          
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

export default User;
