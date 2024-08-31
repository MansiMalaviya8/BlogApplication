import React, { useState, useEffect } from "react";
import { Card, Button, Image } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { deletePost } from "../services/PostAPI";
import { toggleFollow, fetchUser, fetchUserById } from "../services/AuthAPI";

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success"); // success or error

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch current user details
        const currentUser = await fetchUser();
        setUser(currentUser);

        // Fetch creator details
        const creatorData = await fetchUserById(post.created_by);
        setCreator(creatorData);
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

  const handleDelete = async () => {
    if (user) {
      try {
        await deletePost(post.id);
        setToastMessage("Post deleted successfully.");
        setToastType("success");
      } catch (error) {
        setToastMessage("Failed to delete the post.");
        setToastType("error");
      }
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000); // Hide toast after 5 seconds
    } else {
      navigate('/login');
    }
  };

  const confirmDelete = () => {
    handleDelete();
    // Hide modal programmatically
    const modalElement = document.getElementById('deleteConfirmationModal');
    const modal = new window.bootstrap.Modal(modalElement);
    modal.hide();
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
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
              src={creator?.profile_photo || "default_profile.jpeg"}
              roundedCircle
              className="img-fluid me-2"
              alt="User Avatar"
              style={{ width: "40px", height: "40px" }}
            />
            <h6>{creator?.username}</h6>
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
            {user && creator?.id === user.id && (
              <>
                <Button
                  variant="outline-danger"
                  size="sm"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteConfirmationModal"
                  className="mt-2"
                >
                  Delete Post
                </Button>
              </>
            )}
            <Card.Text className="mt-2 mb-3">
              <small className="text-muted">
                {new Date(post.created_at).toLocaleString()}
              </small>
            </Card.Text>
          </Card.Body>
        </Card>
      </div>

      {/* Toast Notification */}
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div
          id="liveToast"
          className={`toast ${showToast ? 'show' : ''} ${toastType === 'success' ? 'bg-success text-light' : 'bg-danger text-light'}`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header">
            <strong className="me-auto">{toastType === 'success' ? 'Success' : 'Error'}</strong>
            <button type="button" className="btn-close" onClick={() => setShowToast(false)} aria-label="Close"></button>
          </div>
          <div className="toast-body">
            {toastMessage}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <div className="modal fade" id="deleteConfirmationModal" tabindex="-1" aria-labelledby="deleteConfirmationModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="deleteConfirmationModalLabel">{post.title}</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              Are you sure you want to delete this post? This action cannot be undone.
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostCard;
