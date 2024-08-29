import React, { useState, useEffect } from "react";
import { Card, Button, Image } from 'react-bootstrap';
import { ThumbsUp, MessageSquare } from "lucide-react";
import { updatePost  } from "../services/PostAPI";
import { toggleFollow, fetchUser,fetchUserById } from "../services/AuthAPI";
import { useNavigate } from "react-router-dom";

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const [creater, setCreater] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch user details
        const currentUser = await fetchUser();
        setUser(currentUser);

        // Fetch creator details
        const createrData = await fetchUserById(post.created_by);
        setCreater(createrData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [post]);

  const handleFollow = async () => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }
    try {
      const result = await toggleFollow(post.created_by, user.id);
      console.log("Follow result:", result);
    } catch (error) {
      console.error("Failed to follow user:", error);
    }
  };

  const handlePost = () => {
    if (user) {
      navigate(`/posts/${post.id}`);
    } else {
      navigate("/login");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="col-lg-4 col-md-6 mb-4">
      <Card
        className="h-100 shadow-sm border-light"
        style={{ transition: "transform 0.2s, box-shadow 0.2s" }}
        onMouseEnter={(e) => {
          e.currentTarget.classList.add("shadow-lg");
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.classList.remove("shadow-lg");
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <div className="d-flex align-items-center m-1">
          <Image
            src={creater?.profile_photo || "default_profile.jpeg"}
            roundedCircle
            className="img-fluid me-2"
            alt="User Avatar"
            style={{ width: "40px", height: "40px" }}
          />
          <h6>{creater?.username}</h6>
        </div>
        <Card.Img
          variant="top"
          src={post.post_photo}
          alt="Post Thumbnail"
          className="img-fluid rounded-top"
          style={{ height: "200px", objectFit: "cover" }}
        />
        <Card.Body className="d-flex flex-column">
          <Card.Title className="mb-3">{post.title}</Card.Title>
          <Card.Text className="flex-grow-1">
            {`${post.content.slice(0, 50)}...`}
          </Card.Text>
          <Button
            variant="outline-dark"
            size="sm"
            onClick={handlePost}
            className="mt-auto"
          >
            Read more
          </Button>
          <Card.Text className="mt-2 mb-3">
            <small className="text-muted">
              {new Date(post.created_at).toLocaleString()}
            </small>
          </Card.Text>


          {/* <div className="d-flex align-items-center mb-3">
            <ThumbsUp style={{ cursor: "pointer" }} />
            <span className="me-3">{post.likes.length} Likes</span>
            <MessageSquare className="me-2" />
            <span>{post.comments.length} Comments</span>
          </div>
          <Button
            variant="outline-dark"
            size="sm"
            onClick={handleFollow}
          >
            Follow
          </Button> */}
        </Card.Body>
      </Card>
    </div>
  );
};

export default PostCard;
