import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  EntityState,
} from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store"; // Adjust the import based on your store file location

// Define the User interface
interface User {
  _id?: string;
  username?: string;
  email?: string;
  token: string;
}

const userAdapter = createEntityAdapter<User>({
  selectId: (user) => user._id,
});

// Define the initial state using the user adapter's getInitialState method
const initialState: EntityState<User> = userAdapter.getInitialState();

// Base URL for the API
const baseUrl = "http://127.0.0.1:5000";

// Create an async thunk for the login action
export const LoginDispatch = createAsyncThunk<User, User>(
  "/login",
  async (userData) => {
    try {
      const response = await axios.post<User>(`${baseUrl}/login`, userData);
      if (response) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", response?.data?.username);
        localStorage.setItem("useremail", response?.data?.email);
      }
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Login failed");
    }
  }
);
export const signupDispatch = createAsyncThunk<User, User>(
  "/signup",
  async (userData) => {
    try {
      const response = await axios.post<User>(`${baseUrl}/signup`, userData);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Login failed");
    }
  }
);

// Create a slice for login
const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(LoginDispatch.fulfilled, (state, action) => {
      userAdapter.addOne(state, action.payload);
    });
    builder.addCase(signupDispatch.fulfilled, (state, action) => {
      console.log(action.payload);
    });
  },
});

// Export the reducer
export default loginSlice.reducer;

// Generate selectors
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = userAdapter.getSelectors((state: RootState) => state.login);
