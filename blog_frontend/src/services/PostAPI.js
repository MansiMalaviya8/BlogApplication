import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

export const searchPosts = async (query) => {
  if (!query) return { posts: [], users: [] };

  try {
    const response = await axios.get(`${API_URL}/search/`, { params: { q: query } });
    return response.data;
  } catch (error) {
    console.error('Error fetching search results:', error);
    return { posts: [], users: [] };
  }
};

export const fetchPosts = async (userId = null) => {
  try {
    const response = await axios.get(`${API_URL}/posts/`);
    const posts = response.data;

    // If a userId is provided, filter posts created by that user
    if (userId) {
      return posts.results.filter(post => post.created_by === userId);
    }

    return posts;

  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Error fetching posts');
  }
};

export const createPost = async (postData) => {
  try {
    const response = await axios.post(`${API_URL}/post/create/`, postData);
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error('Error creating post');
  }
};

export const fetchPostById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching post by ID:', error);
    throw new Error('Error fetching post by ID');
  }
};

export const likePost = async (postId, userId) => {
  try {
    const response = await axios.post(`${API_URL}/posts/like/`, { post_id: postId, user_id: userId });
    return response.data;
  } catch (error) {
    console.error('Error liking post:', error);
    throw new Error('Error liking post');
  }
};

export const fetchComments = async (postId) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${postId}/comments/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw new Error('Error fetching comments');
  }
};

export const addComment = async (postId, userId, content) => {
  try {
    const response = await axios.post(`${API_URL}/comments/add/`, { post_id: postId, user_id: userId, content });
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw new Error('Error adding comment');
  }
};

export const fetchHomePosts = async (user_id) => {
  try {
    const response = await axios.get(`${API_URL}/posts/exclude/${user_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching home posts:', error);
    throw new Error('Error fetching home posts');
  }
};
