import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import i18n from "../../i18n";

const td = (key) => i18n.t(`dashboard.toasts.${key}`, { ns: "translation" });

const BASE_URL = "http://localhost:4000/posts";

export const getPostById = createAsyncThunk(
  "posts/getPostById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getAllPosts = createAsyncThunk(
  "posts/getAllPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(BASE_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addPost = createAsyncThunk(
  "posts/addPost",
  async (postData, { rejectWithValue }) => {
    toast.loading(td("publishing"), { id: "post-toast" });
    try {
      const response = await axios.post(BASE_URL, postData);
      toast.success(td("published"), { id: "post-toast" });
      return response.data;
    } catch (error) {
      toast.error(td("publishFail"), { id: "post-toast" });
      return rejectWithValue(error.message);
    }
  }
);

export const toggleLike = createAsyncThunk(
  "posts/toggleLike",
  async ({ id, userID }, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/${id}`);
      const isLiked = data.likedBy.includes(userID);
      const isDisliked = data.dislikedBy.includes(userID);

      let newPost = { ...data };
      if (isLiked) {
        newPost.likes = data.likes - 1;
        newPost.likedBy = data.likedBy.filter((uid) => uid !== userID);
      } else {
        newPost.likes = data.likes + 1;
        newPost.likedBy = [...data.likedBy, userID];
        if (isDisliked) {
          newPost.dislikes = data.dislikes - 1;
          newPost.dislikedBy = data.dislikedBy.filter((uid) => uid !== userID);
        }
      }

      const response = await axios.put(`${BASE_URL}/${id}`, newPost);
      toast.success(td("reactionUpdated"));
      return response.data;
    } catch (error) {
      toast.error(td("reactionFail"));
      return rejectWithValue(error.message);
    }
  }
);

export const toggleDislike = createAsyncThunk(
  "posts/toggleDislike",
  async ({ id, userID }, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/${id}`);
      const isDisliked = data.dislikedBy.includes(userID);
      const isLiked = data.likedBy.includes(userID);

      let newPost = { ...data };
      if (isDisliked) {
        newPost.dislikes = data.dislikes - 1;
        newPost.dislikedBy = data.dislikedBy.filter((uid) => uid !== userID);
      } else {
        newPost.dislikes = data.dislikes + 1;
        newPost.dislikedBy = [...data.dislikedBy, userID];
        if (isLiked) {
          newPost.likes = data.likes - 1;
          newPost.likedBy = data.likedBy.filter((uid) => uid !== userID);
        }
      }

      const response = await axios.put(`${BASE_URL}/${id}`, newPost);
      toast.success(td("reactionUpdated"));
      return response.data;
    } catch (error) {
      toast.error(td("reactionFail"));
      return rejectWithValue(error.message);
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState: {
    items: [],
    searchQuery: "",
    loading: false,
    error: null,
  },
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getPostById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPostById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(toggleDislike.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const { setSearchQuery } = postSlice.actions;

export const selectAllPosts = (state) => state.posts.items;
export const selectSearchQuery = (state) => state.posts.searchQuery;
export const selectPostsLoading = (state) => state.posts.loading;

export const selectFilteredPosts = (state) => {
  const { items, searchQuery } = state.posts;
  if (!searchQuery.trim()) return items;
  return items.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
};

export default postSlice.reducer;
