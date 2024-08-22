import React, { useState } from 'react';
import { ThumbsUp, MessageSquare } from 'lucide-react';
import { updatePost } from '../services/api';

const PostCard = ({id, title, content, createdAt, onDelete, likes, comments }) => {
    const commentCount = Array.isArray(comments) ? comments.length : 0;
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(likes);

    const likeClicked = async (e) =>{
        const updatedLikes = isLiked ? likeCount - 1 : likeCount + 1;
        setIsLiked(!isLiked);
        setLikeCount(updatedLikes);
        try {
            await updatePost(id, { likes: updatedLikes });
        } catch (error) {
            console.error("Error updating post likes", error);
        }
    }
    return (
        <div className="col">
            <div className="card">
                <img
                    src="/default_blog.jpg"  // Reference to the image in the public folder
                    className="card-img-top"
                    alt="Post Thumbnail"
                />
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">{content}</p>
                    <p className="card-text">
                        <small className="text-body-secondary">
                            {new Date(createdAt).toLocaleString()}
                        </small>
                    </p>
                    <div className="d-flex align-items-center">
                        <ThumbsUp className={`me-2 ${isLiked ? 'text-primary' : ''}`}
                            onClick={likeClicked}
                            style={{ cursor: 'pointer' }}/>
                        <span>{likes} Likes</span>
                        <MessageSquare className="ms-3 me-2" />
                        <span>{commentCount} Comments</span>
                    </div>
                    <button className="btn btn-danger mt-3" onClick={onDelete}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
