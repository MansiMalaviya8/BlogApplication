import React, { useEffect, useState, useContext } from "react";
import { Carousel, Pagination } from "react-bootstrap";
import AuthContext from "../services/AuthContext";
import PostContext from "../services/PostContext";
import PostCard from "./PostCard";
import { fetchUser } from "../services/AuthAPI";

const Posts = () => {
  const { fetchHomePosts, loading, searchResults, fetchPosts } =useContext(PostContext);

  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const userData = await fetchUser();
        setUser(userData)
        let results = [];
        if (userData) {
        results = await fetchHomePosts(userData.id);
        setPosts(Array.isArray(results) ? results: []);

        } else {
        results = await fetchPosts();
        console.log(results)
        setPosts(Array.isArray(results) ? results: []);
        }
        
      } catch (error) {
        // setTotalPages(total_pages);
        console.error("Failed to fetch posts", error);
        setPosts([]); 
      }
    };
    loadPosts();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;

  // Calculate total number of pages
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // Calculate the posts to display for the current page
  const currentPosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const handlePageChange = async (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div>
      <Carousel style={{ marginTop: "75px" }}>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/passion.jpg"
            alt="First slide"
            height="600px"
            width="800px"
          />
          <Carousel.Caption>
            <h3>First Slide</h3>
            <p>Description for the first slide.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/food.jpg"
            alt="Second slide"
            height="600px"
            width="800px"
          />
          <Carousel.Caption>
            <h3>Second Slide</h3>
            <p>Description for the second slide.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/travel.jpg"
            alt="Third slide"
            height="600px"
            width="800px"
          />
          <Carousel.Caption>
            <h3>Third Slide</h3>
            <p>Description for the third slide.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100" // Consistent class with other slides
            src="/news.jpg"
            alt="Fourth slide"
            height="600px"
            width="800px"
          />
          <Carousel.Caption>
            <h3>Fourth Slide</h3>
            <p>Description for the fourth slide.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {loading && <p>Loading...</p>}

      <h1>Posts</h1>
      <div className="posts-list row row-cols-1 row-cols-md-4 g-4">
        {/* Render current posts */}
        {currentPosts.map((post) => (
          <PostCard key={post.id} post={post} currentUser={user} />
        ))}
      </div>

      <Pagination className="justify-content-center mt-4 mb-5">
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {[...Array(totalPages).keys()].map((number) => (
          <Pagination.Item
            key={number + 1}
            active={number + 1 === currentPage}
            onClick={() => handlePageChange(number + 1)}
          >
            {number + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
           
      </Pagination>
    </div>
  );
};

export default Posts;