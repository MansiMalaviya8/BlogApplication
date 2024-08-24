import React, { useState } from 'react';
import { ThumbsUp, MessageSquare } from 'lucide-react';
import { updatePost } from '../services/api';

const PostCard = ({ post, currentuser, onDelete }) => {
    const commentCount = Array.isArray(post.comments) ? post.comments.length : 0;

    const isLiked_value = Array.isArray(post.liked_user_ids) ? post.liked_user_ids.includes(currentuser.id) : false;

    const [isLiked, setIsLiked] = useState(isLiked_value);
    const [likeCount, setLikeCount] = useState(post.likes);
    const [likedId, setLikedId] = useState(post.liked_user_ids);
    const [isExpanded, setIsExpanded] = useState(false); // To toggle content visibility

    const likeClicked = async () => {
        let updatedLikedUserIds;
        setIsLiked(!isLiked);
        if (isLiked) {
            setLikeCount(likeCount + 1);
            updatedLikedUserIds = [...likedId, currentuser.id];
        } else {
            setLikeCount(likeCount - 1);
            updatedLikedUserIds = likedId.filter(id => id !== currentuser.id);
        }
        setLikedId(updatedLikedUserIds);

        const updatedPost = {
            ...post,
            likes: likeCount,
            liked_user_ids: updatedLikedUserIds,
        };

        try {
            await updatePost(post.id, updatedPost);
        } catch (error) {
            console.error("Error updating post likes", error);
        }
    };

    return (
        <div className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100 shadow-sm border-light"> {/* Enhanced card styling */}
                <img
                    src="/default_blog.jpg"  // Reference to the image in the public folder
                    className="card-img-top img-fluid rounded-top"
                    alt="Post Thumbnail"
                    style={{ height: '200px', objectFit: 'cover' }} // Adjust the height and fit
                />
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title mb-3">{post.title}</h5>
                    <p className="card-text flex-grow-1">
                        {isExpanded ? post.content : `${post.content.slice(0, 100)}...`} {/* Preview text */}
                    </p>
                    <button
                        className="btn btn-outline-dark btn-sm"
                        onClick={() => setIsExpanded(!isExpanded)} // Toggle read more
                    >
                        {isExpanded ? 'Read Less' : 'Read More'}
                    </button>
                    <p className="card-text mt-2 mb-3">
                        <small className="text-muted">
                            {new Date(post.created_at).toLocaleString()}
                        </small>
                    </p>
                    <div className="d-flex align-items-center mb-3">
                        <ThumbsUp
                            className={`me-2 ${isLiked ? 'text-primary' : ''}`}
                            onClick={likeClicked}
                            style={{ cursor: 'pointer' }}
                        />
                        <span className="me-3">{likeCount} Likes</span>
                        <MessageSquare className="me-2" />
                        <span>{commentCount} Comments</span>
                    </div>
                    {/* Uncomment and style if delete button needed */}
                    {/* <button className="btn btn-danger w-100" onClick={onDelete}>
                        Delete
                    </button> */}
                </div>
            </div>
        </div>
    );
};

export default PostCard;
