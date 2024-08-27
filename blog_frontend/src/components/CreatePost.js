import React, { useState, useContext,useEffect } from 'react';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PostContext from '../services/PostContext';
import AuthContext from '../services/AuthContext';

const CreatePost = () => {
    const [newPost, setNewPost] = useState({ title: '', content: '', category: 'OTR', post_photo: null });
    const navigate = useNavigate();
    const { createPost } = useContext(PostContext);
    const { user } = useContext(AuthContext);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setNewPost({ ...newPost, [name]: files[0] });
        } else {
            setNewPost({ ...newPost, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', newPost.title);
            formData.append('content', newPost.content);
            formData.append('category', newPost.category);
            if (newPost.post_photo) {
                formData.append('post_photo', newPost.post_photo); // Make sure to append the file
            }
            formData.append('user_id', user.id); // Include user_id in FormData
    
            await createPost(formData);
            alert('Post created successfully!');
            console.log(newPost.post_photo)
            setNewPost({ title: '', content: '', category: 'OTR', post_photo: null });
            navigate('/');
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Error creating post');
        }
    };

    useEffect(() => {
        if(!user){
            navigate('/login')
        }
    },[user]);

    return (
        <div className="container mt-5 pt-5 mb-5">
            
            <Card className="shadow-lg border-0">
                        <Card.Header className="bg-dark text-white text-center rounded-top">
                            <h2 className="mb-0">Create a New Blog Post</h2>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Form onSubmit={handleSubmit} encType="multipart/form-data">
                                {/* First line: Title */}
                                <Form.Group as={Row} className="mb-4" controlId="title">
                                    <Form.Label column md={2} className="fs-5">
                                        Title:
                                    </Form.Label>
                                    <Col md={10}>
                                        <Form.Control
                                            type="text"
                                            size="lg"
                                            name="title"
                                            value={newPost.title}
                                            onChange={handleChange}
                                            placeholder="Enter your post title"
                                            required
                                        />
                                    </Col>
                                </Form.Group>

                                {/* Second line: Content */}
                                <Form.Group as={Row} className="mb-4" controlId="content">
                                    <Form.Label column md={2} className="fs-5">
                                        Content:
                                    </Form.Label>
                                    <Col md={10}>
                                        <Form.Control
                                            as="textarea"
                                            rows={6}
                                            size="lg"
                                            name="content"
                                            value={newPost.content}
                                            onChange={handleChange}
                                            placeholder="Write your post content here"
                                            required
                                        />
                                    </Col>
                                </Form.Group>

                                {/* Third line: Category on the left, Photo on the right */}
                                <Row className="mb-4">
                                    <Col md={6}>
                                        <Form.Group as={Row} controlId="category">
                                            <Form.Label column md={4} className="fs-5">
                                                Category:
                                            </Form.Label>
                                            <Col md={8}>
                                                <Form.Control
                                                    as="select"
                                                    size="lg"
                                                    name="category"
                                                    value={newPost.category}
                                                    onChange={handleChange}
                                                >
                                                    <option value="POL">Politics</option>
                                                    <option value="BOL">Bollywood</option>
                                                    <option value="SPO">Sports</option>
                                                    <option value="TEC">Technology</option>
                                                    <option value="OTR">Others</option>
                                                </Form.Control>
                                            </Col>
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group as={Row} controlId="post_photo">
                                            <Form.Label column md={3} className="fs-5">
                                                Post Photo:
                                            </Form.Label>
                                            <Col md={9}>
                                                <Form.Control
                                                    type="file"
                                                    size="lg"
                                                    name="post_photo"
                                                    onChange={handleChange}
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Last line: Create button */}
                                <div className="d-flex justify-content-end">
                                    <Button variant="dark" size="md" type="submit" className="px-5">
                                        Post
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
        </div>
    );
};

export default CreatePost;