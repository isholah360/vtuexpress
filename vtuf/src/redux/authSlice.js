// redux/authSlice.js - Add this action to your existing slice

import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    // ADD THIS NEW ACTION
    updateWalletBalance: (state, action) => {
      if (state.user) {
        state.user.walletBalance = action.payload;
        // Update localStorage to persist the change
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    // ADD THIS ACTION TO UPDATE FULL USER DATA
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        // Update localStorage to persist the change
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    }
  },
});

export const { loginSuccess, logout, updateWalletBalance, updateUser } = authSlice.actions;
export default authSlice.reducer;