import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = "https://jsonplaceholder.typicode.com/users";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axios.get(API);
  return response.data;
});

export const createUser = createAsyncThunk(
  "users/createUser",
  async (newUser) => {
    const response = await axios.post(API, newUser);
    return { ...response.data, localId: crypto.randomUUID() };
  },
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, localId, name, email }) => {
    const response = await axios.put(`${API}/${id}`, { name, email });
    return { ...response.data, localId };
  },
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (user) => {
    await axios.delete(`${API}/${user.id}`);
    return user.localId;
  },
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    status: "idle",
    error: null,
    mutationStatus: "idle",
    mutationError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload.map((user) => ({
          ...user,
          localId: user.id,
        }));
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createUser.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.users.unshift(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.error.message;
      })
      .addCase(updateUser.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        const index = state.users.findIndex(
          (user) => user.localId === action.payload.localId,
        );
        if (index !== -1) state.users[index] = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.error.message;
      })
      .addCase(deleteUser.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.users = state.users.filter(
          (user) => user.localId !== action.payload,
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError = action.error.message;
      });
  },
});

export default userSlice.reducer;