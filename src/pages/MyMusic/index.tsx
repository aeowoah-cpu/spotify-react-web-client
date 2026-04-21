import { FC, RefObject, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { localPlayerActions, LocalTrack } from '../../store/slices/localPlayer';
import { audioPlayer } from '../../utils/audioPlayer';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const msToTime = (ms: number): string => {
  const totalSec = Math.floor(ms / 1000);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// ─── Icons ────────────────────────────────────────────────────────────────────

const UploadIcon = () => (
  <svg viewBox='0 0 24 24' fill='currentColor' width='18' height='18'>
    <path d='M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z' />
  </svg>
);

const DeleteIcon = () => (
  <svg viewBox='0 0 24 24' fill='currentColor' width='16' height='16'>
    <path d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z' />
  </svg>
);

const MusicNoteIcon = () => (
  <svg viewBox='0 0 24 24' fill='#b3b3b3' width='20' height='20'>
    <path d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z' />
  </svg>
);

// ─── Track Row ────────────────────────────────────────────────────────────────

const TrackRow: FC<{ track: LocalTrack; index: number }> = ({ track, index }) => {
  const dispatch = useAppDispatch();
  const currentTrackId = useAppSelector((state) => state.localPlayer.currentTrackId);
  const isPlaying = useAppSelector((state) => state.localPlayer.isPlaying);
  const isActive = currentTrackId === track.id;

  const handlePlay = () => {
    if (isActive) {
      isPlaying ? audioPlayer.pause() : audioPlayer.play();
    } else {
      dispatch(localPlayerActions.setCurrentTrack(track.id));
      audioPlayer.setSource(track.url, true);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isActive) audioPlayer.pause();
    dispatch(localPlayerActions.removeTrack(track.id));
    URL.revokeObjectURL(track.url);
  };

  return (
    <div
      className={`track-row${isActive ? ' active' : ''}`}
      onClick={handlePlay}
      role='row'
      aria-label={`Play ${track.name} by ${track.artist}`}
    >
      <span className='track-row-num'>
        {isActive && isPlaying ? (
          <svg viewBox='0 0 24 24' fill='#1db954' width='14' height='14'>
            <rect x='4' y='4' width='4' height='16' rx='1'>
              <animate attributeName='height' values='16;8;16' dur='0.8s' repeatCount='indefinite' />
              <animate attributeName='y' values='4;8;4' dur='0.8s' repeatCount='indefinite' />
            </rect>
            <rect x='10' y='4' width='4' height='16' rx='1'>
              <animate attributeName='height' values='8;16;8' dur='0.8s' repeatCount='indefinite' />
              <animate attributeName='y' values='8;4;8' dur='0.8s' repeatCount='indefinite' />
            </rect>
            <rect x='16' y='4' width='4' height='16' rx='1'>
              <animate attributeName='height' values='16;4;16' dur='1s' repeatCount='indefinite' />
              <animate attributeName='y' values='4;10;4' dur='1s' repeatCount='indefinite' />
            </rect>
          </svg>
        ) : (
          index + 1
        )}
      </span>
      <div className='track-row-info'>
        <span className='track-row-name'>{track.name}</span>
        <span className='track-row-artist'>{track.artist}</span>
      </div>
      <span className='track-row-album'>{track.album}</span>
      <span className='track-row-duration'>{track.duration ? msToTime(track.duration) : '--:--'}</span>
      <div className='track-row-actions'>
        <button onClick={handleDelete} aria-label={`Remove ${track.name}`}>
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState: FC<{ onUpload: () => void }> = ({ onUpload }) => (
  <div className='my-music-empty'>
    <div style={{ marginBottom: 16, opacity: 0.4 }}>
      <MusicNoteIcon />
    </div>
    <p>No tracks uploaded yet.</p>
    <button className='upload-button-large' onClick={onUpload}>
      <UploadIcon />
      Upload your first track
    </button>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

interface MyMusicPageProps {
  container?: RefObject<HTMLDivElement>;
}

const MyMusicPage: FC<MyMusicPageProps> = () => {
  const dispatch = useAppDispatch();
  const tracks = useAppSelector((state) => state.localPlayer.tracks);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('audio/')) continue;
      const url = URL.createObjectURL(file);

      const duration = await new Promise<number>((resolve) => {
        const audio = new Audio();
        audio.addEventListener('loadedmetadata', () => resolve(Math.floor(audio.duration * 1000)));
        audio.addEventListener('error', () => resolve(0));
        audio.src = url;
      });

      const baseName = file.name.replace(/\.[^.]+$/, '');
      const parts = baseName.split(' - ');
      const name = parts.length >= 2 ? parts.slice(1).join(' - ').trim() : baseName.trim();
      const artist = parts.length >= 2 ? parts[0].trim() : 'Unknown Artist';

      const track: LocalTrack = {
        id: `track_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        name,
        artist,
        album: 'My Music',
        duration,
        url,
      };

      dispatch(localPlayerActions.addTrack(track));
    }
  };

  return (
    <div className='my-music-page'>
      <div className='my-music-header'>
        <div style={{ marginBottom: 8, opacity: 0.6 }}>
          <svg viewBox='0 0 24 24' fill='white' width='64' height='64'>
            <path d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z' />
          </svg>
        </div>
        <h1>My Music</h1>
        <p className='my-music-subtitle'>
          {tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}
        </p>
      </div>

      <div className='my-music-upload-area'>
        <button
          className='upload-button-large'
          onClick={() => inputRef.current?.click()}
          aria-label='Upload music files'
        >
          <UploadIcon />
          Upload Tracks
        </button>
        <span style={{ color: '#b3b3b3', fontSize: '0.8rem' }}>
          Supports MP3, WAV, FLAC, M4A &mdash; name files as &ldquo;Artist - Title.mp3&rdquo; for auto-detection
        </span>
      </div>

      <input
        ref={inputRef}
        type='file'
        accept='audio/*'
        multiple
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
        onClick={(e) => ((e.target as HTMLInputElement).value = '')}
      />

      <div className='my-music-tracks'>
        {tracks.length === 0 ? (
          <EmptyState onUpload={() => inputRef.current?.click()} />
        ) : (
          <>
            <div className='tracks-table-header' role='row'>
              <span>#</span>
              <span>Title</span>
              <span>Album</span>
              <span style={{ textAlign: 'right' }}>Duration</span>
              <span />
            </div>
            {tracks.map((track, i) => (
              <TrackRow key={track.id} track={track} index={i} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default MyMusicPage;
