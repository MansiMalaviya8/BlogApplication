import React, { useState, useEffect } from "react";

import { searchPosts } from "../services/PostAPI";
import PostCard from "./PostCard";
import { fetchUser } from "../services/AuthAPI";

const SearchResults = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState([]);


  const handleSearch = async () => {
    try {

      const userData = await fetchUser();
      setUser(userData);

      // Call the searchPosts function from the API
      const { posts: searchPostsData, users: searchUsers } = await searchPosts(
        searchTerm
      );
      // Filter posts by category if needed
      const filteredPosts =
        selectedCategory === "All"
          ? searchPostsData
          : searchPostsData.filter(
              (post) => post.category === selectedCategory
            );

      setPosts(filteredPosts);
      setUsers(searchUsers);
    } catch (error) {
      console.error("Failed to fetch search results", error);
    }
  };

  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);
    if (searchTerm === "") {
      const { posts: searchPostsData, users: searchUsers } = await searchPosts(
        category
      );
      // Filter posts by category if needed
      const filteredPosts =
        selectedCategory === "All"
          ? searchPostsData
          : searchPostsData.filter(
              (post) => post.category === selectedCategory
            );

      setPosts(filteredPosts);
      setUsers(searchUsers);
    } else {
      handleSearch(); // Trigger search when category changes
    }
  };

  // Inline styles
  const containerStyle = {
    marginTop: "80px", // Adjust based on the height of your navbar
    position: "relative",
    zIndex: 1000,
  };

  const resultsStyle = {
    marginTop: "20px",
    maxHeight: "500px", // Adjust based on your needs
    overflowY: "auto",
  };

  useEffect(() => {
    // Perform search whenever searchTerm or selectedCategory changes
    handleSearch();
  }, [searchTerm, selectedCategory]);

  return (
    <>
      <div style={containerStyle} className="input-group mb-3">
        <button
          className="btn btn-outline-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {selectedCategory}
        </button>
        <ul className="dropdown-menu dropdown-menu-end">
          <li>
            <a
              className="dropdown-item"
              onClick={() => handleCategorySelect("All")}
            >
              All
            </a>
          </li>
          <li>
            <a
              className="dropdown-item"
              onClick={() => handleCategorySelect("POL")}
            >
              Politics
            </a>
          </li>
          <li>
            <a
              className="dropdown-item"
              onClick={() => handleCategorySelect("BOL")}
            >
              Bollywood
            </a>
          </li>
          <li>
            <a
              className="dropdown-item"
              onClick={() => handleCategorySelect("SPO")}
            >
              Sports
            </a>
          </li>
          <li>
            <a
              className="dropdown-item"
              onClick={() => handleCategorySelect("TEC")}
            >
              Technology
            </a>
          </li>
          <li>
            <a
              className="dropdown-item"
              onClick={() => handleCategorySelect("OTR")}
            >
              Others
            </a>
          </li>
        </ul>
        <input
          type="text"
          className="form-control"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Text input with dropdown button"
        />
      </div>

      <div>
        <h2>Posts</h2>

        <div className="posts-list row row-cols-1 row-cols-md-4 g-4">
          {posts.length === 0 ? (
            <p>No posts found.</p>
          ) : (
            <>
              {/* Render current posts */}
              {posts.map((post) => (
                <PostCard key={post.id} post={post} currentUser={user} />
              ))}
            </>
          )}
        </div>
      </div>

      <div>
        <h2>Users</h2>
        {users.length > 0 ? (
                users.map(user => (
                    <div className="card mb-3" style={{ maxWidth: '400px' }} key={user.id}>
                        <div className="row g-0">
                            <div className="col-md-4">
                                <img
                                    src={user.profile_photo || 'default_profile.jpeg'} // Replace with a default image URL if needed
                                    className="img-fluid rounded-start"
                                    alt={user.username}
                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                />
                            </div>
                            <div className="col-md-8">
                                <div className="card-body">
                                    <h5 className="card-title">{user.username}</h5>
                                    <p className="card-text">Email: {user.email}</p>
                                   
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>No users found</p>
            )}
      </div>
    </>
  );
};

export default SearchResults;
