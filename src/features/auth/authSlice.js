import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:4000/users";

export const loginUser = createAsyncThunk("auth/login", async (userData) => {
  toast.loading("Logging in...", { id: "login-toast" });
  try {
    const res = await axios.get(`${API_URL}?email=${userData.email}`);
    if (res.data.length > 0) {
      if (res.data[0].password !== userData.password) {
        throw new Error("Invalid email or password");
      }
      const user = res.data[0];
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Logged in successfully!", { id: "login-toast" });
      return user;
    } else {
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    toast.error(error.message || "Login failed", { id: "login-toast" });
    throw error;
  }
});

export const registerUser = createAsyncThunk("auth/register", async (userData) => {
  toast.loading("Creating account...", { id: "reg-toast" });
  try {
    const res = await axios.post(API_URL, userData);
    localStorage.setItem("user", JSON.stringify(res.data));
    toast.success("Account created successfully!", { id: "reg-toast" });
    return res.data;
  } catch (error) {
    toast.error("Registration failed. Please try again.", { id: "reg-toast" });
    throw error;
  }
});

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
    checkUser: (state) => {
      const user = localStorage.getItem("user");
      if (user) {
        state.user = JSON.parse(user);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout, checkUser } = authSlice.actions;
export default authSlice.reducer;