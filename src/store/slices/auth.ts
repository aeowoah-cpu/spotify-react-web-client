import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Interfaces
import type { User } from '../../interfaces/user';

const initialState: { token?: string; playerLoaded: boolean; user?: User; requesting: boolean } = {
  user: undefined,
  requesting: false,
  playerLoaded: true,
  token: undefined,
};

// Stub thunk kept for compatibility with components that still import it
export const loginToSpotify = () => ({ type: 'auth/noOp' });
export const fetchUser = () => ({ type: 'auth/noOp' });

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRequesting(state, action: PayloadAction<{ requesting: boolean }>) {
      state.requesting = action.payload.requesting;
    },
    setToken(state, action: PayloadAction<{ token?: string }>) {
      state.token = action.payload.token;
    },
    setPlayerLoaded(state, action: PayloadAction<{ playerLoaded: boolean }>) {
      state.playerLoaded = action.payload.playerLoaded;
    },
    setUser(state, action: PayloadAction<{ user: User }>) {
      state.user = action.payload.user;
      state.requesting = false;
    },
    logout(state) {
      state.user = undefined;
      state.token = undefined;
    },
  },
});

export const authActions = { ...authSlice.actions, loginToSpotify, fetchUser };

export default authSlice.reducer;
