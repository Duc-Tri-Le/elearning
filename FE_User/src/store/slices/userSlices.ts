"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserState = {
  user_name: string | null;
  email: string | null;
  available: boolean;
  isLoggedIn: boolean;
  birthday: string | null;
  created_at: Date | null;
};

const initialState: UserState = {
  user_name: null,
  email: null,
  available: false,
  isLoggedIn: false,
  birthday: null,
  created_at: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        user_name: string;
        email: string;
        available: boolean;
        birthday: string;
        created_at: Date;
      }>
    ) => {
      state.user_name = action.payload.user_name;
      state.email = action.payload.email;
      state.available = action.payload.available;
      state.birthday = action.payload.birthday;
      state.created_at = action.payload.created_at;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.user_name = null;
      state.email = null;
      state.available = false;
      state.birthday = null;
      state.created_at = null;
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = userSlice.actions;
export const userReducer = userSlice.reducer;
