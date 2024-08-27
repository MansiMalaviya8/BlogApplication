import React, { useContext, useEffect, useState } from 'react';
import PostContext from '../services/PostContext';
import AuthContext from '../services/AuthContext';
import { Container, Form, Row, Col, Button, ListGroup, Card } from 'react-bootstrap';

const CommentSection = ({ postId, onCommentCountChange }) => {
    const { fetchComments, addComment } = useContext(PostContext);
    const { user } = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAllComments, setShowAllComments] = useState(false);

    const loadComments = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchComments(postId);
            setComments(data);
            onCommentCountChange(data.length);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (postId) {
            loadComments();
        }
    }, [postId]);

    const handleAddComment = async () => {
        if (!user) {
            alert('User not logged in');
            return;
        }
        if (!newComment.trim()) {
            alert('Comment cannot be empty');
            return;
        }
        try {
            await addComment(postId, user.id, newComment);
            setNewComment('');
            await loadComments(); // Reload comments after adding
        } catch (error) {
            console.error('Failed to add comment', error);
        }
    };

    const handleToggleComments = () => {
        setShowAllComments((prevState) => !prevState);
    };

    return (
        <Container className="mt-4">
            {loading && <p>Loading comments...</p>}
            {error && <p className="text-danger">{error}</p>}

            <Card className="mb-4">
                <Card.Body>
                    {/* Input Section */}
                    <div className="mb-3">
                        <Row>
                            <Col md={10}>
                                <Form.Control 
                                    type="text"
                                    placeholder="Add a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="border-0 rounded-0 border-black"
                                />
                            </Col>
                            <Col md={2} className="d-flex justify-content-end">
                                <Button className='btn btn-dark' onClick={handleAddComment}>Add Comment</Button>
                            </Col>
                        </Row>
                    </div>

                    {/* Underline */}
                    <div className="border-bottom mb-3"></div>

                    {/* Comment Display Section */}
                    <ListGroup>
                        {comments.length > 0 ? (
                            comments.slice(0, showAllComments ? undefined : 1).map((comment) => (
                                <ListGroup.Item key={comment.id} className="border-0">
                                    <strong>{comment.user.username}</strong>: {comment.content}
                                </ListGroup.Item>
                            ))
                        ) : (
                            <ListGroup.Item className="border-0">No comments yet.</ListGroup.Item>
                        )}
                    </ListGroup>

                    {/* Show More/Less Button */}
                    {comments.length > 1 && (
                        <Button className='btn btn-dark mt-3' onClick={handleToggleComments}>
                            {showAllComments ? 'Show less comments' : 'Show more comments'}
                        </Button>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CommentSection;
