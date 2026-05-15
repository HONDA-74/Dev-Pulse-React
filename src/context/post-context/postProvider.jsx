import { PostContext } from "./post-context";
import axios from "axios";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const cardsArr = useRef([]);

  const onSearch = (value) => {
    if (!value.trim()) {
      setPosts(cardsArr.current);
      return;
    }
    setPosts(
      cardsArr.current.filter((card) =>
        card.title.toLowerCase().includes(value.toLowerCase()),
      ),
    );
  };

  const getAllPosts = async () => {
    try {
      const response = await axios.get("http://localhost:4000/posts");
      setPosts(response.data);
      cardsArr.current = response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getPostById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:4000/posts/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const addPost = async (postData) => {
    toast.loading("Publishing post...", { id: "post-toast" });
    try {
      const response = await axios.post(
        "http://localhost:4000/posts",
        postData,
      );
      toast.success("Post published!", { id: "post-toast" });
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error("Failed to publish post.", { id: "post-toast" });
    }
  };

  const addLike = async (id, userID) => {
    try {
      const { data } = await axios.get(`http://localhost:4000/posts/${id}`);

      const isLiked = data.likedBy.includes(userID);
      const isDisliked = data.dislikedBy.includes(userID);

      let newPost = { ...data };

      if (isLiked) {
        newPost.likes = data.likes - 1;
        newPost.likedBy = data.likedBy.filter((id) => id !== userID);
      } else {
        newPost.likes = data.likes + 1;
        newPost.likedBy = [...data.likedBy, userID];

        if (isDisliked) {
          newPost.dislikes = data.dislikes - 1;
          newPost.dislikedBy = data.dislikedBy.filter((id) => id !== userID);
        }
      }

      await axios.put(`http://localhost:4000/posts/${id}`, newPost);
      getAllPosts();
      toast.success("Updated reaction");
    } catch (error) {
      console.log(error);
      toast.error("Could not update like status");
    }
  };

  const addDislike = async (id, userID) => {
    try {
      const { data } = await axios.get(`http://localhost:4000/posts/${id}`);

      const isDisliked = data.dislikedBy.includes(userID);
      const isLiked = data.likedBy.includes(userID);

      let newPost = { ...data };

      if (isDisliked) {
        newPost.dislikes = data.dislikes - 1;
        newPost.dislikedBy = data.dislikedBy.filter((id) => id !== userID);
      } else {
        newPost.dislikes = data.dislikes + 1;
        newPost.dislikedBy = [...data.dislikedBy, userID];

        if (isLiked) {
          newPost.likes = data.likes - 1;
          newPost.likedBy = data.likedBy.filter((id) => id !== userID);
        }
      }

      await axios.put(`http://localhost:4000/posts/${id}`, newPost);
      getAllPosts();
      toast.success("Updated reaction");
    } catch (error) {
      console.log(error);
      toast.error("Could not update like status");
    }
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        getAllPosts,
        getPostById,
        addPost,
        onSearch,
        addLike,
        addDislike,
      }}>
      {children}
    </PostContext.Provider>
  );
};
