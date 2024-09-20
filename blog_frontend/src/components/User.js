import React, { useState, useEffect } from "react";
import { Container, Row, Col, Image, Spinner, Alert } from "react-bootstrap";
import {
  fetchUser,
  fetchFollowCounts,
  fetchUserById,
  toggleFollow
} from "../services/AuthAPI"; // Adjust the path as necessary
import { deletePost, fetchPosts } from "../services/PostAPI";
import PostCard from "./PostCard";
import { useParams, useNavigate } from "react-router-dom";

// import Modal from "./Modal";

const User = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [followCounts, setFollowCounts] = useState({
    follower_count: 0,
    following_count: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const [posts, setPosts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [isFollowing, setIsFollowing] = useState(false); // Initial state can be set based on props

  useEffect(() => {
    const loadData = async () => {
      try {
        if (isAuthenticated()) {
          // Fetch user details
          const userDetails = await fetchUser();
          const profileDetails = await fetchUserById(userId);

          if(userDetails.id === profileDetails.id){
            navigate("/profile")
          }

          setUser(userDetails);
          setProfile(profileDetails);

          // Fetch follow counts
          const followCountsData = await fetchFollowCounts(profileDetails.id);
         
          setFollowCounts(followCountsData);
          setIsFollowing(
            followCountsData.followers_list.some(
              (f) => (f.following_user_id = userDetails.id)
            ));

          // Fetch posts
          const profilePosts = await fetchPosts(profileDetails.id);
          setPosts(profilePosts);
          
          // console.log(userPosts)

          setLoading(false);
        } else {
          setError("User not authenticated");
          setLoading(false);
            navigate("/login");
        }
      } catch (err) {
        setError("Failed to load profile data", err);
        setLoading(false);
      }
    };

    loadData();
    setIsFollowing(isFollowing)
  }, []);

  const isAuthenticated = () => {
    const token = localStorage.getItem("accessToken");
    return token;
  };

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
  };

  const handleFollow = async () => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }
    try {
      const result = await toggleFollow(userId, user.id);

       setIsFollowing(!isFollowing)
       if(!isFollowing){
        setFollowCounts(prevCounts => ({
          ...prevCounts,
          follower_count: prevCounts.follower_count + 1,
        }));
       }
       else{
        setFollowCounts(prevCounts => ({
          ...prevCounts,
          follower_count: prevCounts.follower_count - 1,
        }));
       }
       


      console.log("Follow result:", result);
    } catch (error) {
      console.error("Failed to follow user:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (postToDelete) {
      try {
        await deletePost(postToDelete.id);
        setPosts(posts.filter((post) => post.id !== postToDelete.id));
        setPostToDelete(null);
        setToastMessage("Post deleted successfully.");
        setToastType("success");
      } catch (error) {
        setToastMessage("Failed to delete the post.");
        setToastType("error");
      }
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }
  };

  const handleModalClose = () => {
    setPostToDelete(null);
    setIsModalVisible(false);
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <Container style={{ marginTop: "75px" }}>
        <Row className="align-items-center">
          <Col xs={4} md={3} className="position-relative">
            <Image
              src={profile.profile_photo || "/default_profile.jpeg"}
              roundedCircle
              className="w-100 h-100"
              alt="User Avatar"
            />
          </Col>
          <Col xs={8} md={9}>
            <h3>{profile.username}</h3>
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
              <button className="btn btn-dark m-3 w-25" onClick={handleFollow}>
              {userId !== user.id && (isFollowing ? "Following" : "Follow")}
              </button>
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
                    <PostCard
                      key={post.id}
                      post={post}
                      currentUser={user}
                      onDelete={() => handleDeleteClick(post)}
                    />
                  ))}
                </div>
              </>
            )}
          </Col>
        </Row>
        {/* Bootstrap Modal */}
        <div
          className="modal fade"
          id="deleteConfirmationModal"
          data-bs-backdrop="static"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Delete Confirmation
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {postToDelete
                  ? `Are you sure you want to delete the post titled "${postToDelete.title}"?`
                  : ""}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  onClick={handleDeleteConfirm}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
          <div
            id="liveToast"
            className={`toast ${showToast ? "show" : ""} ${
              toastType === "success"
                ? "bg-success text-light"
                : "bg-danger text-light"
            }`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="toast-header">
              <strong className="me-auto">
                {toastType === "success" ? "Success" : "Error"}
              </strong>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowToast(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="toast-body">{toastMessage}</div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default User;
