import React, { useContext, useEffect,useState } from 'react';
import PostContext from '../services/PostContext';
import AuthContext from '../services/AuthContext';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { ThumbsUp, MessageSquare } from 'lucide-react';


const Post = () => {
    const { postId } = useParams();
    const {likePost,fetchPostById}=useContext(PostContext)
    const {user}=useContext(AuthContext)

    const [postById, setPostById] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    console.log(postId)
    const getPost = async (id) => {
        setLoading(true);
        setError(null); // Clear previous errors
        try {
            const data = await fetchPostById(id);
            // console.log(data); // Log data to check its structure
            setPostById(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
    }
    };

    useEffect(() => {
        console.log(postId); // Ensure this logs the correct postId
        if (postId) {
            getPost(postId);
       }
    },[postId]);

    const handleLike = async () => {
        if (!user.id) {
            alert('User not logged in');
            return;
        }
        
        try {
            console.log(postById)
            await likePost(postById.id, user.id);
            await getPost(postById.id)
        } catch (error) {
            console.error('Failed to like post', error);
        }
    };

    return (
        <Container className="mt-5 mb-5">
            {loading && <p>Loading...</p>}
            {postById && (
            <Row className="justify-content-center">
                <Col md={10}>
                    <Card className="shadow-lg mt-5">
                        <Row className="g-0"> {/* Use g-0 to remove gutter spacing */}
                            <Col md={4}>
                                <Card.Img 
                                    src={postById.post_photo} 
                                    alt={postById.title} 
                                    className="img-fluid h-100" 
                                    style={{ objectFit: 'cover' }}
                                />
                            </Col>
                            <Col md={8}>
                                <Card.Body>
                                    <Card.Title as="h1" className="mb-3">{postById.title}</Card.Title>
                                    <Card.Text className="text-muted mb-3">
                                        <strong>Category:</strong> {postById.category} | <strong>By:</strong> {postById.created_by_username} | <strong>Posted on:</strong> {new Date(postById.created_at).toLocaleString()}
                                    </Card.Text>
                                    <div className="d-flex align-items-center mb-3">
                                        <ThumbsUp style={{ cursor: 'pointer' }}   onClick={handleLike}/>
                                        <span className="me-3">{postById.likes.length} Likes</span>
                                        <MessageSquare className="me-2" />
                                        <span>{postById.comments.length} Comments</span>
                                    </div>
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
        </Container>
    );
};

export default Post;
