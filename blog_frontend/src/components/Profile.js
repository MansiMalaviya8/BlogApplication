import React, { useState, useEffect } from "react";
import { Container, Row, Col, Image, Form, Spinner, Alert } from "react-bootstrap";
import { Pencil } from "lucide-react";
import { fetchUser, fetchFollowCounts, editProfile } from '../services/AuthAPI'; // Adjust the path as necessary
import { fetchPosts } from "../services/PostAPI";
import PostCard from "./PostCard";

const Profile = () => {
  const [followCounts, setFollowCounts] = useState({
    follower_count: 0,
    following_count: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (isAuthenticated()) {
          // Fetch user details
          const userDetails = await fetchUser();
          setUser(userDetails);

          // Fetch follow counts
          const followCountsData = await fetchFollowCounts(userDetails.id);
          setFollowCounts(followCountsData);

          // Fetch posts
          const userPosts = await fetchPosts(userDetails.id);
          setPosts(userPosts);

          setLoading(false);
        } else {
          setError("User not authenticated");
          setLoading(false);
        }
      } catch (err) {
        setError("Failed to load profile data");
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const isAuthenticated = () => {
    const token = localStorage.getItem('accessToken');
    return !!token;
  };

  const handleProfilePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      try {
        await editProfile(file, user.id);
        const updatedUser = await fetchUser();
        setUser(updatedUser);
      } catch (err) {
        setError("Failed to update profile photo");
      }
    }
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container className="mt-5">
      <Row className="align-items-center">
        <Col xs={4} md={3} className="position-relative">
          <Image
            src={user.profile_photo || "default_profile.jpeg"}
            roundedCircle
            className="img-fluid"
            alt="User Avatar"
          />
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleProfilePhotoChange}
            className="d-none"
            id="profilePhotoInput"
          />
          <Pencil
            size={24}
            className="position-absolute"
            style={{ top: "75%", right: "10%" }}
            onClick={() => document.getElementById("profilePhotoInput").click()}
          />
        </Col>
        <Col xs={8} md={9}>
          <h3>{user.username}</h3>
          <div className="d-flex justify-content-start">
            <div className="me-4">
              <strong>{posts.length}</strong> Posts
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
      {/* You can uncomment and adjust the following to display posts */}
      <Row className="mt-4">
        <Col xs={12}>
          <h5>Posts</h5>
          {posts.length === 0 ? (
            <p>No posts available.</p>
          ) : (
            <>
            <div className="posts-list row row-cols-1 row-cols-md-3 g-4">
              {/* Render current posts */}
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            </>
          )}
        </Col>
      </Row> 
    </Container>
  );
};

export default Profile;
