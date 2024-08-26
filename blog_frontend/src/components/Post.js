import React, { useContext, useEffect, useState } from 'react';
import PostContext from '../services/PostContext';
import AuthContext from '../services/AuthContext';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { ThumbsUp, MessageSquare } from 'lucide-react';
import CommentSection from './CommentSection';

const Post = () => {
    const { postId } = useParams();
    const { likePost, fetchPostById } = useContext(PostContext);
    const { user,fetchUser,isAuthenticated } = useContext(AuthContext);
    const [postById, setPostById] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isLiked,setIsLiked]=useState(false)
    const [comments,setComments]=useState([])
    const [commentCount, setCommentCount] = useState(0); 
    
    
    const getPost = async (id) => {
        setLoading(true);
        setError(null); // Clear previous errors
        try {
            const data = await fetchPostById(id);
            setPostById(data);
            setIsLiked(postById.likes.includes(user.id)) 
            setComments(data.comments) 
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getPost(postId)
    }, [postId]);

    const handleLike = async () => {
        if (!isAuthenticated) {
            alert('User not logged in');
            return;
        }
        try {
            await likePost(postById.id, user.id);
            await getPost(postById.id);
            setIsLiked(!isLiked)
            
        } catch (error) {
            console.error('Failed to like post', error);
        }
        
    };

    return (
        <Container className="mt-5 mb-5">
            {postById && (
                <Row className="justify-content-center">
                    <Col md={10}>
                        <Card className="shadow-lg mt-5">
                            {/* Upper Section: Image on Left, Details on Right */}
                            <Row className="g-0">
                                <Col md={6}>
                                    <Card.Img 
                                        src={postById.post_photo} 
                                        alt={postById.title} 
                                        className="img-fluid h-80" 
                                        style={{ objectFit: 'cover', borderRight: '2px solid #ddd',margin:'10px'}} // Add border to separate sections
                                    />
                                </Col>
                                <Col md={5} className='m-4'>
                                    <Card.Body>
                                        <Card.Title as="h1" className="mb-3">
                                            {postById.title}
                                        </Card.Title>
                                        <Card.Text className="text-muted mb-3">
                                            <strong>Category:</strong> {postById.category} | 
                                            <strong>By:</strong> {postById.created_by_username} | 
                                            <strong>Posted on:</strong> {new Date(postById.created_at).toLocaleString()}
                                        </Card.Text>
                                        <div className="d-flex align-items-center mb-3">
                                            <ThumbsUp
                                                className={`me-2 ${isLiked ? 'text-primary' : ''}`}
                                                style={{ cursor: 'pointer' }} 
                                                onClick={handleLike} 
                                            />
                                            <span className="me-3">{postById.likes.length} Likes</span>
                                            <MessageSquare className="me-2" />
                                            <span>{commentCount} Comments</span>
                                        </div>
                                    </Card.Body>
                                </Col>
                            </Row>

                            {/* Lower Section: Post Content */}
                            <Row className="g-0">
                                <Col>
                                    <Card.Body>
                                        <Card.Text className="mt-4">
                                            {postById.content}
                                        </Card.Text>
                                    </Card.Body>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            )}

            <CommentSection postId={postId} onCommentCountChange={setCommentCount} />
        </Container>
    );
};

export default Post;
