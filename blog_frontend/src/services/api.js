import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/posts/';

export const getPosts = () => axios.get(API_URL);
export const createPost = (post) => axios.post(API_URL, post);
export const updatePost = (id, post) => axios.put(`${API_URL}${id}/`, post);
export const deletePost = (id) => axios.delete(`${API_URL}${id}/`);


const API_URL1 = 'http://127.0.0.1:8000/api/users/';
export const getUsers=()=>axios.get(API_URL1)
export const createUser=(user)=>axios.post(API_URL1,user)