import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create Context
export const PostContext = createContext();

// Create Provider
export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]); // make it into an array
  

  useEffect(() => {
    const getAllPosts = async () => {
      try {
        const { data } = await axios.get('/post/get-all-posts');
        setPosts(data?.posts || []); 
      } catch (error) {
        console.error(error);
      }
    };

    getAllPosts();
  }, []);

  return (
    <PostContext.Provider value={[posts, setPosts]}>
      {children}
    </PostContext.Provider>
  );
};