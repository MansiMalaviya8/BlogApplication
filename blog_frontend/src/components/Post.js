import React, { useContext, useState } from "react";
import { Container, Row, Col, Card, Image } from "react-bootstrap";
import { ThumbsUp, MessageSquare } from "lucide-react";
import { useParams } from "react-router-dom";
import PostContext from "../services/PostContext";
import AuthContext from "../services/AuthContext";
import CommentSection from "./CommentSection";

const Post = () => {
  const { postId } = useParams();
  const { likePost, fetchPostById } = useContext(PostContext);
  const { fetchUser, isAuthenticated, fetchUserById } = useContext(AuthContext);

  const [postById, setPostById] = useState(null);
  const [userById, setUserById] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const post = await fetchPostById(postId);
      setPostById(post);

      // Fetch current user
      const currentUser = await fetchUser();
      setUser(currentUser);
      console.log(post.likes.includes(currentUser.id))

      setIsLiked(post.likes.includes(currentUser.id));
      // Fetch post creator
      const postCreator = await fetchUserById(post.created_by);
      setUserById(postCreator);
      // Check if the current user has liked the post
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert("User not logged in");
      return;
    }
    try {
      if (user) {
        await likePost(postById.id, user.id);
        // Fetch updated post data after liking
        await fetchData();
        setIsLiked(!isLiked);
      }
    } catch (error) {
      console.error("Failed to like post", error);
    }
  };

  const handleLoadPost = async () => {
    if (postId) {
      await fetchData();
    }
  };

  // Initial data fetch when the component mounts
  React.useEffect(() => {
    handleLoadPost();
  }, [postId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <Container className="mt-8 mb-5" style={{ marginTop: "5rem" }}>
      {postById && (
        <Card className="shadow-lg ">
          <div className="d-flex align-items-center ms-3 mt-2">
                  <Image
                    src={userById?.profile_photo || "default_profile.jpeg"}
                    roundedCircle
                    className="img-fluid me-2"
                    alt="User Avatar"
                    style={{ width: "40px", height: "40px" }}
                  />
                  <h4>{userById?.username}</h4>
                </div>
          <Row className="g-0">
            <Col md={6} className="d-flex align-items-center justify-content-center p-2">
              <Card.Img
                src={postById.post_photo}
                alt={postById.title}
                className="img-fluid"
                style={{ objectFit: "cover", maxHeight: "400px" }}
              />
            </Col>
            <Col md={6}>
              <Card.Body>
                <h2 className="mb-3 ">{postById.title}</h2>
                {/* <strong >Category: </strong> {postById.category} 
                <br ></br> */}
                <strong > Posted on: </strong>{new Date(postById.created_at).toLocaleString()}
                
                <div className="d-flex align-items-center mb-3 mt-3">
                  <ThumbsUp
                    className={`me-2 ${isLiked ? "text-primary" : ""}`}
                    style={{ cursor: "pointer" }}
                    onClick={handleLike}
                  />
                  <span className="me-3">{postById.likes.length} Likes</span>
                  <MessageSquare className="me-2" />
                  <span>{commentCount} Comments</span>
                </div>
              </Card.Body>
            </Col>
          </Row>
          <p className="fs-5 m-3">{postById.content}</p>
          <Card.Body style={{ fontSize: "1.25rem" }}>
            <CommentSection
              postId={postId}
              onCommentCountChange={setCommentCount}
            />
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Post;































// import React, { useContext, useEffect, useState } from "react";
// import { Container, Row, Col, Card, Image } from "react-bootstrap";
// import { ThumbsUp, MessageSquare } from "lucide-react";
// import { useParams } from "react-router-dom";
// import PostContext from "../services/PostContext";
// import AuthContext from "../services/AuthContext";
// import CommentSection from "./CommentSection";

// const Post = () => {
//   const { postId } = useParams();
//   const { likePost, fetchPostById } = useContext(PostContext);
//   const { fetchUser, isAuthenticated, fetchUserById } = useContext(AuthContext);
//   const [postById, setPostById] = useState(null);
//   const [userById, setUserById] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [isLiked, setIsLiked] = useState(false);
//   const [commentCount, setCommentCount] = useState(0);
//   const [user,setUser]=useState(null)

//   const getPost = async (id) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await fetchPostById(id);
//       const init_user=await fetchUser()
//       setUser(init_user)
      
//       const createdby=data.created_by;
//       setPostById(data);
//       setIsLiked(data.likes.includes(user.id));
//       console.log(createdby)
//       const userData = await fetchUserById(data.created_by);
//       setUserById(userData);
      
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getUser = async (userId) => {
//     setLoading(true);
//     setError(null);
//     try {
      
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (postId) {
//       getPost(postId);
//     }
//   }, [postId]);

//   const handleLike = async () => {
//     if (!isAuthenticated) {
//       alert("User not logged in");
//       return;
//     }
//     try {
//       console.log(user.id)
//       await likePost(postById.id, user.id);
//       await getPost(postById.id);
//       setIsLiked(postById.likes.includes(user.id));
//     } catch (error) {
//       console.error("Failed to like post", error);
//     }
//   };

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   // if (error) {
//   //   return <p>Error: {error}</p>;
//   // }

//   return (
//     <Container className="mt-8 mb-5" style={{ marginTop: "5rem" }}>
//       {/* {console.log(postById)} */}
//       {postById && (
//         <Card className="shadow-lg mt-">
//           <Row className="g-0">
//             <Col md={6} className="d-flex align-items-center justify-content-center p-2">
//               <Card.Img
//                 src={postById.post_photo}
//                 alt={postById.title}
//                 className="img-fluid"
//                 style={{ objectFit: "cover", maxHeight: "400px" }}
//               />
//             </Col>
//             <Col md={6}>
//               <Card.Body>
//                 <Card.Title className="mb-3">{postById.title}</Card.Title>
//                 <strong>Category:</strong> {postById.category} |
//                 <div className="d-flex align-items-center ms-2">
//                   <Image
//                     src={userById?.profile_photo || "default_profile.jpeg"}
//                     roundedCircle
//                     className="img-fluid me-2"
//                     alt="User Avatar"
//                     style={{ width: "50px", height: "50px" }}
//                   />
//                   <span>{userById?.username}</span>
//                 </div>
//                 <strong> Posted on:</strong>{" "}
//                 {new Date(postById.created_at).toLocaleString()}
//                 <div className="d-flex align-items-center mb-3">
//                   <ThumbsUp
//                     className={`me-2 ${isLiked ? "text-primary" : ""}`}
//                     style={{ cursor: "pointer" }}
//                     onClick={handleLike}
//                   />
//                   <span className="me-3">{postById.likes.length} Likes</span>
//                   <MessageSquare className="me-2" />
//                   <span>{commentCount} Comments</span>
//                 </div>
//               </Card.Body>
//             </Col>
//           </Row>
//           <p className="fs-5 m-3">{postById.content}</p>
//           <Card.Body style={{ fontSize: "1.25rem" }}>
//             <CommentSection
//               postId={postId}
//               onCommentCountChange={setCommentCount}
//             />
//           </Card.Body>
//         </Card>
//       )}
//     </Container>
//   );
// };

// export default Post;
