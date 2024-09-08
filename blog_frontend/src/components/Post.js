import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Image } from "react-bootstrap";
import { ThumbsUp, MessageSquare, AwardIcon } from "lucide-react";
import { useParams } from "react-router-dom";
import PostContext from "../services/PostContext";
import AuthContext from "../services/AuthContext";
import CommentSection from "./CommentSection";
import { fetchFollowCounts, toggleFollow } from "../services/AuthAPI";
import { toggleFollow } from "../services/AuthAPI";
import { useNavigate } from 'react-router-dom';

const Post = () => {
  const { postId } = useParams();
  const { likePost, fetchPostById } = useContext(PostContext);
  const { fetchUser, isAuthenticated, fetchUserById } = useContext(AuthContext);
  const [postById, setPostById] = useState(null);
  const [userById, setUserById] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false); // Initial state can be set based on props
  const navigate = useNavigate();


  let liked = false;
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch current user
      const currentUser = await fetchUser();
      setUser(currentUser);
      // console.log(currentUser)

      const post = await fetchPostById(postId);
      setPostById(post);

      setIsLiked(post.likes.some((like) => like.id === currentUser.id));
      // Fetch post creator
      const postCreator = await fetchUserById(post.created_by);
      setUserById(postCreator);

      const followersList = await fetchFollowCounts(postCreator.id);
      setIsFollowing(
        followersList.followers_list.some(
          (f) => (f.following_user_id = currentUser.id)
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }
    try {
      const result = await toggleFollow(postById.created_by, user.id);

       setIsFollowing(!isFollowing)
      // const followersList = await fetchFollowCounts(postById.created_by);
      // setIsFollowing(
      //   followersList.followers_list.some(
      //     (f) => (f.following_user_id = user.id)
      //   )
      // );
      console.log("Follow result:", result);
    } catch (error) {
      console.error("Failed to follow user:", error);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert("User not logged in");
      return;
    }
    try {
      if (user) {
        await likePost(postById.id, user.id);
        // Fetch updated post data after liking
        const post = await fetchPostById(postId);
        setPostById(post);

        setIsLiked(!isLiked);
      }
    } catch (error) {
      console.error("Failed to like post", error);
    }
  };

  const handleLoadPost = async () => {
    if (postId) {
      await fetchData();
    }
  };
  const handleCreaterProfile=()=>{
    navigate(`/users/${postById.created_by}`);

  }


  // Initial data fetch when the component mounts
  useEffect(() => {
    handleLoadPost();
    setIsLiked(liked);
    setIsFollowing(isFollowing)
  }, [postId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <Container className="mt-8 mb-5" style={{ marginTop: "5rem" }}>
      {postById && (
        <Card className="shadow-lg ">
          <div className="d-flex align-items-center ms-3 mt-2" onClick={handleCreaterProfile} style={{ cursor: "pointer" }}>
            <Image
              src={userById?.profile_photo || "/default_profile.jpeg"}
              roundedCircle
              className="img-fluid me-2"
              alt="User Avatar"
              style={{ width: "40px", height: "40px" }}
            />
            <h6>
              {userById?.username && (
                <>
                  <span>{userById.username}</span>
                  <span onClick={handleFollow}>
                    <b style={{ cursor: "pointer" }}>
                      {userById.id !== user.id &&
                        (isFollowing ? "• Following" : "• Follow")}
                    </b>
                  </span>
                </>
              )}
            </h6>
          </div>
          <Row className="g-0">
            <Col
              md={6}
              className="d-flex align-items-center justify-content-center p-2"
            >
              <Card.Img
                src={postById.post_photo}
                alt={postById.title}
                className="img-fluid"
                style={{ objectFit: "cover", maxHeight: "400px" }}
              />
            </Col>
            <Col md={6}>
              <Card.Body>
                <h2 className="mb-3 ">{postById.title}</h2>
                {/* <strong >Category: </strong> {postById.category} 
                <br ></br> */}
                <strong> Posted on: </strong>
                {new Date(postById.created_at).toLocaleString()}

                <div className="d-flex align-items-center mb-3 mt-3">
                  <ThumbsUp
                    className={`me-2 ${isLiked ? "text-primary" : ""}`}
                    style={{ cursor: "pointer" }}
                    onClick={handleLike}
                  />
                  <span className="me-3">{postById.likes.length} Likes</span>
                  <MessageSquare className="me-2" />
                  <span>{commentCount} Comments</span>
                </div>
              </Card.Body>
            </Col>
          </Row>
          <p className="fs-5 m-3">{postById.content}</p>
          <Card.Body style={{ fontSize: "1.25rem" }}>
            <CommentSection
              postId={postId}
              onCommentCountChange={setCommentCount}
            />
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Post;
