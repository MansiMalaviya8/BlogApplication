import React, { useContext, useEffect, useState, useCallback } from "react";
import { Container, Row, Col, Image, Form, Spinner, Alert } from "react-bootstrap";
import { Pencil } from "lucide-react";
import AuthContext from "../services/AuthContext";
import PostContext from "../services/PostContext";

const Profile = () => {
  const { fetchUser, fetchFollowCounts, editProfile, isAuthenticated } = useContext(AuthContext);
  const { fetchPosts } = useContext(PostContext);
  const [followCounts, setFollowCounts] = useState({
    follower_count: 0,
    following_count: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [posts, setPosts] = useState([]);

  // Define the async function outside useEffect
  const loadData = useCallback(async () => {
    try {
      // Fetch user details
      const userDetails = await fetchUser();
      setUser(userDetails);

      // Fetch follow counts
      const followCountsData = await fetchFollowCounts(userDetails.id);
      setFollowCounts(followCountsData);

      // Fetch posts
      const userPosts = await fetchPosts(userDetails.id);
      setPosts(userPosts);

      setLoading(false);
    } catch (err) {
      setError("Failed to load profile data");
      setLoading(false);
    }
  }, [fetchUser, fetchFollowCounts, fetchPosts]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  const handleProfilePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      try {
        await editProfile(file, user.id);
        const updatedUser = await fetchUser();
        setUser(updatedUser);
      } catch (err) {
        setError("Failed to update profile photo");
      }
    }
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container className="mt-5">
      <Row className="align-items-center">
        <Col xs={4} md={3} className="position-relative">
          <Image
            src={user.profile_photo || "default_profile.jpeg"}
            roundedCircle
            className="img-fluid"
            alt="User Avatar"
          />
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleProfilePhotoChange}
            className="d-none"
            id="profilePhotoInput"
          />
          <Pencil
            size={24}
            className="position-absolute"
            style={{ top: "75%", right: "10%" }}
            onClick={() => document.getElementById("profilePhotoInput").click()}
          />
        </Col>
        <Col xs={8} md={9}>
          <h3>{user.username}</h3>
          <div className="d-flex justify-content-start">
            <div className="me-4">
              <strong>{posts.length}</strong> Posts
            </div>
            <div className="me-4">
              <strong>{followCounts.follower_count}</strong> Followers
            </div>
            <div className="me-4">
              <strong>{followCounts.following_count}</strong> Following
            </div>
          </div>
        </Col>
      </Row>
      {/* <Row className="mt-4">
        <Col xs={12}>
          <h5>Posts</h5>
          {posts.length === 0 ? (
            <p>No posts available.</p>
          ) : (
            posts.map(post => (
              <div key={post.id} className="mb-3">
                <h6>{post.title}</h6>
                <p>{post.content}</p>
              </div>
            ))
          )}
        </Col>
      </Row> */}
    </Container>
  );
};

export default Profile;












































// import React, { useContext, useEffect, useState } from "react";
// import { Container, Row, Col, Image, Form, Spinner } from "react-bootstrap";
// import { Pencil } from "lucide-react";
// import AuthContext from "../services/AuthContext";
// import PostContext from "../services/PostContext";

// const Profile = () => {
//   const { fetchUser, fetchFollowCounts, editProfile,isAuthenticated } = useContext(AuthContext);
//   const { fetchPosts } = useContext(PostContext);
//   const [followCounts, setFollowCounts] = useState({
//     follower_count: 0,
//     following_count: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null);
//   const [profilePhoto, setProfilePhoto] = useState(null);
//   const [postCount, setPostCount] = useState(0);
//   const [userPosts, setUserPosts] = useState(0);
//   const [posts,setPosts]=useState(null);

  
  

//   const handleProfilePhotoChange = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setProfilePhoto(file);
//       try {
//         await editProfile(file, user.id);
//         const updatedUser = await fetchUser();
//         setUser(updatedUser);
//       } catch (err) {
//         setError("Failed to update profile photo");
//       }
//     }
//   };

  

//   return (
//     <Container className="mt-5">
//       <Row className="align-items-center">
//         <Col xs={4} md={3} className="position-relative">
//           <Image
//             src={user.profile_photo || "default_profile.jpeg"}
//             roundedCircle
//             className="img-fluid"
//             alt="User Avatar"
//           />
//           <Form.Control
//             type="file"
//             accept="image/*"
//             onChange={handleProfilePhotoChange}
//             className="d-none"
//             id="profilePhotoInput"
//           />
//           <Pencil
//             size={24}
//             className="position-absolute"
//             style={{ top: "75%", right: "10%" }}
//             onClick={() => document.getElementById("profilePhotoInput").click()}
//           />
//         </Col>
//         <Col xs={8} md={9}>
//           <h3>{user.username}</h3>
//           <div className="d-flex justify-content-start">
//             <div className="me-4">
//               {/* <strong>{postCount}</strong> Posts */}
//             </div>
//             <div className="me-4">
//               <strong>{followCounts.follower_count}</strong> Followers
//             </div>
//             <div className="me-4">
//               <strong>{followCounts.following_count}</strong> Following
//             </div>
//           </div>
//         </Col>
//       </Row>
//       <Row className="mt-4">
//         <Col xs={12}>
//           <h5>Posts</h5>
//           <p>No posts available.</p>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Profile;




