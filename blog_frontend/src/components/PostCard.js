import React, { useContext, useState } from 'react';
import { ThumbsUp, MessageSquare } from 'lucide-react';
import { updatePost } from '../services/api';
import  PostContext  from '../services/PostContext';
import  AuthContext  from '../services/AuthContext';
import { useNavigate } from 'react-router-dom';


const PostCard = ({ post }) => {
    const {user,toggleFollow,fetchUser}=useContext(AuthContext)
    const navigate = useNavigate();


   

    const handleFollow = async () => {
        try {
            // Assuming currentUserId is available in your component
            const result = await toggleFollow(post.created_by, user.id);
            await fetchUser();

            console.log('Follow result:', result);
            // Handle the result as needed (e.g., update UI or state)
        } catch (error) {
            console.error('Failed to follow user:', error);
            // Handle errors (e.g., show an error message to the user)
            }
        };

    const handlePost = async () => {
        navigate(`/posts/${post.id}`)    
    };



    return (
        <div className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100 shadow-sm border-light"> {/* Enhanced card styling */}
                <img
                    src={post.post_photo}  // Reference to the image in the public folder
                    className="card-img-top img-fluid rounded-top"
                    alt="Post Thumbnail"
                    style={{ height: '200px', objectFit: 'cover' }} // Adjust the height and fit
                />
                <div className="card-body d-flex flex-column">
                <h5 className="card-title mb-3">{post.created_by_username}</h5>
                    <h5 className="card-title mb-3">{post.title}</h5>
                    <p className="card-text flex-grow-1">
                        { `${post.content.slice(0, 50)}...`}
                    </p>
                    <button className="btn btn-outline-dark btn-sm" onClick={handlePost}>
                        Read more
                    </button>
                    <p className="card-text mt-2 mb-3">
                        <small className="text-muted">
                            {new Date(post.created_at).toLocaleString()}
                        </small>
                    </p>
                    <div className="d-flex align-items-center mb-3">
                        <ThumbsUp
                            // className={`me-2 ${user in post.likes ? 'text-primary' : ''}`}
                            style={{ cursor: 'pointer' }}
                           
                        />
                        <span className="me-3">{post.likes.length} Likes</span>
                        <MessageSquare className="me-2" />
                        <span>{post.comments.length} Comments</span>
                    </div>
                     <button className="btn btn-outline-dark btn-sm" onClick={handleFollow}> 
                        Follow
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
