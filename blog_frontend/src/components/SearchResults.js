import React, { useState, useEffect } from "react";
import { searchPosts } from "../services/PostAPI";
import PostCard from "./PostCard";
import { fetchUser } from "../services/AuthAPI";
import { Search } from "lucide-react"; // Import the Search icon from Lucide
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation to access query parameters


const SearchResults = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchKeywords, setSearchKeywords] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState([]);
  const [showPosts, setShowPosts] = useState(true); // State to toggle between showing posts and users

  const handleSearch = async () => {
    try {
      const userData = await fetchUser();
      setUser(userData);

      setSearchKeywords(searchTerm === "")
      const { posts: searchPostsData, users: searchUsers } = await searchPosts(searchTerm);

      const filteredPosts =
        selectedCategory === "All"
          ? searchPostsData
          : searchPostsData.filter((post) => post.category === selectedCategory);

          console.log(filteredPosts);
      setPosts(filteredPosts);
      setUsers(searchUsers);
    } catch (error) {
      console.error("Failed to fetch search results", error);
    }
  };

  const handleCategorySelect = async (category) => {
    console.log("ry",category)
    await setSelectedCategory(category);
    if (searchTerm === "") {
      const { posts: searchPostsData, users: searchUsers } = await searchPosts(category);

      console.log(searchPostsData);
      console.log(selectedCategory)
      // const filteredPosts =
      //   category === "All"
      //     ? searchPostsData
      //     : searchPostsData.filter((post) => (post.category === category)&&(post.created_by!==user.id));
          // console.log(filteredPosts);

      setPosts(searchPostsData);
      setUsers(searchUsers);
    } else {
      handleSearch();
    }
  };

  const location = useLocation(); // Hook to access URL location
  const queryParams = new URLSearchParams(location.search);
  const categoryFromQuery = queryParams.get("category");
  const navigate = useNavigate();
  
  useEffect(() => {
    
    if (categoryFromQuery) {
      setSelectedCategory(categoryFromQuery);
      handleCategorySelect(categoryFromQuery);
      navigate("/search")
    }
    // if(selectedCategory){
    //   handleCategorySelect(selectedCategory);

    // }
    if(searchTerm){

      handleSearch();
    }
  }, [searchTerm]);

  return (
    <div className="container" style={{ marginTop: "5rem" }}>
      {/* Search and category selection */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        {/* Category buttons */}
        <div className="btn-group">
          <button
            className={`btn ${selectedCategory === "All" ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => handleCategorySelect("All")}
          >
            All
          </button>
          <button
            className={`btn ${selectedCategory === "POL" ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => handleCategorySelect("POL")}
          >
            Politics
          </button>
          <button
            className={`btn ${selectedCategory === "BOL" ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => handleCategorySelect("BOL")}
          >
            Bollywood
          </button>
          <button
            className={`btn ${selectedCategory === "SPO" ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => handleCategorySelect("SPO")}
          >
            Sports
          </button>
          <button
            className={`btn ${selectedCategory === "TEC" ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => handleCategorySelect("TEC")}
          >
            Technology
          </button>
          <button
            className={`btn ${selectedCategory === "OTR" ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => handleCategorySelect("OTR")}
          >
            Others
          </button>
        </div>

        {/* Search input */}
        <div className="input-group" style={{ maxWidth: "400px" }}>
          <input
            type="text"
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search"
            placeholder="Search..."
          />
          <span className="input-group-text">
            <Search />
          </span>
        </div>
      </div>

      {/* Toggle between posts and users */}
      <div className="btn-group mb-4">
        <button
          className={`btn ${showPosts ? "btn-dark" : "btn-outline-dark"}`}
          onClick={() => setShowPosts(true)}
        >
          Posts
        </button>
        <button
          className={`btn ${!showPosts ? "btn-dark" : "btn-outline-dark"}`}
          onClick={() => setShowPosts(false)}
        >
          Users
        </button>
      </div>

      {/* Display posts or users based on selection */}
      <div className="row">
        {showPosts ? (
          <div className="col-12">
            <div className="row row-cols-1 row-cols-md-4 g-4">
              {posts.length === 0 ? (
                <p>No posts found.</p>
              ) : (
                posts.map((post) => (
                    <PostCard post={post} currentUser={user} />
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="col-12">
            {users.length > 0 ? (
              users.map((user) => (
                <div className="card mb-3" style={{ maxWidth: "540px" }} key={user.id}>
                  <div className="row g-0">
                    <div className="col-md-4">
                      <img
                        src={user.profile_photo || "default_profile.jpeg"}
                        className="img-fluid rounded-start"
                        alt={user.username}
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
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
              <p>No users found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
