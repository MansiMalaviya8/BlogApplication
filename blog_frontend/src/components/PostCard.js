import React from 'react';

const PostCard = ({ title, content, createdAt, onDelete }) => {
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
                    <button className="btn btn-danger" onClick={onDelete}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
