import React, { useContext, useEffect, useState } from 'react';
import PostContext from '../services/PostContext';
import AuthContext from '../services/AuthContext';
import { Container, Form, Button, ListGroup, ListGroupItem } from 'react-bootstrap';

const CommentSection = ({ postId, onCommentCountChange }) => {
    const { fetchComments, addComment } = useContext(PostContext);
    const { user } = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

    return (
        <Container className="mt-4">
            {loading && <p>Loading comments...</p>}
            {error && <p className="text-danger">{error}</p>}
            <Form>
                <Form.Group controlId="comment">
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" className="mt-2" onClick={handleAddComment}>
                    Add Comment
                </Button>
            </Form>
            <ListGroup className="mt-4">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <ListGroupItem key={comment.id}>
                            <strong>{comment.user.username}</strong>: {comment.content}
                        </ListGroupItem>
                    ))
                ) : (
                    <ListGroupItem>No comments yet.</ListGroupItem>
                )}
            </ListGroup>
        </Container>
    );
};

export default CommentSection;