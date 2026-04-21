/**
 * audioPlayer.ts
 * Singleton HTMLAudioElement wrapper. Drives the localPlayer Redux slice.
 * Import `audioPlayer` wherever play/pause/seek controls are needed.
 */
import { store } from '../store/store';
import { localPlayerActions } from '../store/slices/localPlayer';

class AudioPlayerService {
  private audio: HTMLAudioElement;

  constructor() {
    this.audio = new Audio();
    this.audio.volume = 1;

    this.audio.addEventListener('play', () => {
      store.dispatch(localPlayerActions.setPlaying(true));
    });

    this.audio.addEventListener('pause', () => {
      store.dispatch(localPlayerActions.setPlaying(false));
    });

    this.audio.addEventListener('timeupdate', () => {
      store.dispatch(localPlayerActions.setPosition(Math.floor(this.audio.currentTime * 1000)));
    });

    this.audio.addEventListener('durationchange', () => {
      if (!isNaN(this.audio.duration)) {
        store.dispatch(localPlayerActions.setDuration(Math.floor(this.audio.duration * 1000)));
      }
    });

    this.audio.addEventListener('ended', () => {
      const state = store.getState().localPlayer;
      if (state.repeat === 'track') {
        this.audio.currentTime = 0;
        this.audio.play().catch(() => {});
      } else {
        store.dispatch(localPlayerActions.next());
        // After dispatching next, load the newly selected track
        requestAnimationFrame(() => {
          const updated = store.getState().localPlayer;
          if (updated.currentTrackId) {
            const track = updated.tracks.find((t) => t.id === updated.currentTrackId);
            if (track && track.url) {
              this.setSource(track.url, true);
            }
          }
        });
      }
    });
  }

  setSource(url: string, autoPlay = true) {
    this.audio.src = url;
    this.audio.load();
    if (autoPlay) {
      this.audio.play().catch(() => {});
    }
  }

  play() {
    this.audio.play().catch(() => {});
  }

  pause() {
    this.audio.pause();
  }

  toggle() {
    if (this.audio.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  seek(ms: number) {
    this.audio.currentTime = ms / 1000;
  }

  setVolume(vol: number) {
    this.audio.volume = Math.max(0, Math.min(1, vol));
  }

  getVolume() {
    return this.audio.volume;
  }
}

export const audioPlayer = new AudioPlayerService();
