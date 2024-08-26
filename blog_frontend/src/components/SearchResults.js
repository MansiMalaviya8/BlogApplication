import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import  PostContext  from '../services/PostContext';

const SearchResults = () => {
    const { searchResults, searchPosts, loading } = useContext(PostContext);
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('q');

    useEffect(() => {
        if (query) {
            searchPosts(query);
        }
    }, [query, searchPosts]);

    return (
        <div>
            {loading && <p>Loading...</p>}
            <div>
                {/* Conditionally render posts section */}
                {searchResults.posts.length > 0 && (
                    <>
                        <h2>Posts</h2>
                        {searchResults.posts.map(post => (
                            <div key={post.id}>
                                <h3>{post.title}</h3>
                                <p>{post.content}</p>
                            </div>
                        ))}
                    </>
                )}

                {/* Conditionally render users section */}
                {searchResults.users.length > 0 && (
                    <>
                        <h2>Users</h2>
                        {searchResults.users.map(user => (
                            <div key={user.id}>
                                <h3>{user.username}</h3>
                                <p>{user.email}</p>
                            </div>
                        ))}
                    </>
                )}

                {/* Display message if no results found */}
                {searchResults.posts.length === 0 && searchResults.users.length === 0 && query.length > 2 && (
                    <p>No results found.</p>
                )}
            </div>
        </div>
    );
};

export default SearchResults;