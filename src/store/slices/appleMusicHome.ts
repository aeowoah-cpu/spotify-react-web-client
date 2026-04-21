import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getNewReleases, getTopSongs } from '../../services/appleMusic';
import type { AppleMusicTrack, AppleMusicAlbum } from '../../services/appleMusic';

interface AppleMusicHomeState {
  topSongs: AppleMusicTrack[];
  newReleases: AppleMusicAlbum[];
  loading: boolean;
}

const initialState: AppleMusicHomeState = {
  topSongs: [],
  newReleases: [],
  loading: false,
};

export const fetchAppleTopSongs = createAsyncThunk(
  'appleMusicHome/fetchTopSongs',
  async () => getTopSongs()
);

export const fetchAppleNewReleases = createAsyncThunk(
  'appleMusicHome/fetchNewReleases',
  async () => getNewReleases()
);

const appleMusicHomeSlice = createSlice({
  name: 'appleMusicHome',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppleTopSongs.pending, (state) => { state.loading = true; })
      .addCase(fetchAppleTopSongs.fulfilled, (state, action) => {
        state.topSongs = action.payload;
        state.loading = false;
      })
      .addCase(fetchAppleTopSongs.rejected, (state) => { state.loading = false; })
      .addCase(fetchAppleNewReleases.fulfilled, (state, action) => {
        state.newReleases = action.payload;
      });
  },
});

export const appleMusicHomeActions = {
  fetchAppleTopSongs,
  fetchAppleNewReleases,
};

export default appleMusicHomeSlice.reducer;
