import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:4000/posts";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await axios.get(API_URL);
  return response.data;
});

export const addPost = createAsyncThunk("posts/addPost", async (postData) => {
  toast.loading("Publishing post...", { id: "post-toast" });
  try {
    const response = await axios.post(API_URL, postData);
    toast.success("Post published!", { id: "post-toast" });
    return response.data;
  } catch (error) {
    toast.error("Failed to publish post.", { id: "post-toast" });
    throw error;
  }
});

export const toggleReaction = createAsyncThunk(
  "posts/toggleReaction",
  async ({ id, userId, type }, { dispatch, getState }) => {
    const { posts } = getState().posts;
    const post = posts.find((p) => p.id === id);
    if (!post) return;

    let newPost = { ...post };
    const isLiked = post.likedBy.includes(userId);
    const isDisliked = post.dislikedBy.includes(userId);

    if (type === "like") {
      if (isLiked) {
        newPost.likes = post.likes - 1;
        newPost.likedBy = post.likedBy.filter((uid) => uid !== userId);
      } else {
        newPost.likes = post.likes + 1;
        newPost.likedBy = [...post.likedBy, userId];
        if (isDisliked) {
          newPost.dislikes = post.dislikes - 1;
          newPost.dislikedBy = post.dislikedBy.filter((uid) => uid !== userId);
        }
      }
    } else if (type === "dislike") {
      if (isDisliked) {
        newPost.dislikes = post.dislikes - 1;
        newPost.dislikedBy = post.dislikedBy.filter((uid) => uid !== userId);
      } else {
        newPost.dislikes = post.dislikes + 1;
        newPost.dislikedBy = [...post.dislikedBy, userId];
        if (isLiked) {
          newPost.likes = post.likes - 1;
          newPost.likedBy = post.likedBy.filter((uid) => uid !== userId);
        }
      }
    }

    try {
      await axios.put(`${API_URL}/${id}`, newPost);
      toast.success("Updated reaction");
      return newPost;
    } catch (error) {
      toast.error("Could not update reaction");
      throw error;
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    loading: false,
    error: null,
    searchQuery: "",
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
      })
      .addCase(toggleReaction.fulfilled, (state, action) => {
        const index = state.posts.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      });
  },
});

export const { setSearchQuery } = postsSlice.actions;
export default postsSlice.reducer;
