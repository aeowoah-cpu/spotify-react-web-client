import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LocalTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: number; // milliseconds
  url: string; // blob URL
  coverUrl?: string;
}

type RepeatMode = 'off' | 'all' | 'track';

interface LocalPlayerState {
  tracks: LocalTrack[];
  currentTrackId: string | null;
  isPlaying: boolean;
  position: number; // ms
  duration: number; // ms
  shuffle: boolean;
  repeat: RepeatMode;
  volume: number; // 0–1
}

const initialState: LocalPlayerState = {
  tracks: [],
  currentTrackId: null,
  isPlaying: false,
  position: 0,
  duration: 0,
  shuffle: false,
  repeat: 'off',
  volume: 1,
};

const localPlayerSlice = createSlice({
  name: 'localPlayer',
  initialState,
  reducers: {
    addTrack(state, action: PayloadAction<LocalTrack>) {
      // Avoid duplicate ids
      if (!state.tracks.find((t) => t.id === action.payload.id)) {
        state.tracks.push(action.payload);
      }
    },
    removeTrack(state, action: PayloadAction<string>) {
      state.tracks = state.tracks.filter((t) => t.id !== action.payload);
      if (state.currentTrackId === action.payload) {
        state.currentTrackId = null;
        state.isPlaying = false;
        state.position = 0;
        state.duration = 0;
      }
    },
    setCurrentTrack(state, action: PayloadAction<string | null>) {
      state.currentTrackId = action.payload;
      state.position = 0;
      if (action.payload) {
        const track = state.tracks.find((t) => t.id === action.payload);
        state.duration = track?.duration ?? 0;
      } else {
        state.duration = 0;
      }
    },
    setPlaying(state, action: PayloadAction<boolean>) {
      state.isPlaying = action.payload;
    },
    setPosition(state, action: PayloadAction<number>) {
      state.position = action.payload;
    },
    setDuration(state, action: PayloadAction<number>) {
      state.duration = action.payload;
    },
    setVolume(state, action: PayloadAction<number>) {
      state.volume = action.payload;
    },
    toggleShuffle(state) {
      state.shuffle = !state.shuffle;
    },
    toggleRepeat(state) {
      if (state.repeat === 'off') state.repeat = 'all';
      else if (state.repeat === 'all') state.repeat = 'track';
      else state.repeat = 'off';
    },
    next(state) {
      if (!state.tracks.length) return;
      if (state.shuffle) {
        const others = state.tracks.filter((t) => t.id !== state.currentTrackId);
        if (others.length) {
          const next = others[Math.floor(Math.random() * others.length)];
          state.currentTrackId = next.id;
          state.duration = next.duration;
          state.position = 0;
        }
        return;
      }
      const idx = state.tracks.findIndex((t) => t.id === state.currentTrackId);
      const nextIdx = idx + 1;
      if (nextIdx < state.tracks.length) {
        const track = state.tracks[nextIdx];
        state.currentTrackId = track.id;
        state.duration = track.duration;
        state.position = 0;
      } else if (state.repeat === 'all') {
        const track = state.tracks[0];
        state.currentTrackId = track.id;
        state.duration = track.duration;
        state.position = 0;
      } else {
        state.isPlaying = false;
      }
    },
    prev(state) {
      if (!state.tracks.length) return;
      const idx = state.tracks.findIndex((t) => t.id === state.currentTrackId);
      const prevIdx = idx - 1;
      if (prevIdx >= 0) {
        const track = state.tracks[prevIdx];
        state.currentTrackId = track.id;
        state.duration = track.duration;
        state.position = 0;
      } else {
        // Restart current track from beginning
        state.position = 0;
      }
    },
  },
});

export const localPlayerActions = localPlayerSlice.actions;
export default localPlayerSlice.reducer;
