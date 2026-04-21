import { FC, memo, useEffect, useRef } from 'react';
import { useAppSelector } from '../../../../store/store';
import { audioPlayer } from '../../../../utils/audioPlayer';

// ─── PlayerSync: bridges Redux currentTrackId changes → audioPlayer ───────────
export const PlayerSync: FC = memo(() => {
  const currentTrackId = useAppSelector((state) => state.localPlayer.currentTrackId);
  const isPlaying = useAppSelector((state) => state.localPlayer.isPlaying);
  const tracks = useAppSelector((state) => state.localPlayer.tracks);
  const prevIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!currentTrackId) return;
    if (currentTrackId === prevIdRef.current) return;

    prevIdRef.current = currentTrackId;
    const track = tracks.find((t) => t.id === currentTrackId);
    if (track?.url) {
      audioPlayer.setSource(track.url, isPlaying);
    }
  }, [currentTrackId]); // intentionally only on currentTrackId changes

  return null;
});

// ─── Default music icon cover ─────────────────────────────────────────────────
const MusicNoteSvg = () => (
  <svg viewBox='0 0 24 24' fill='#b3b3b3' width='36' height='36'>
    <path d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z' />
  </svg>
);

// ─── SongDetails ──────────────────────────────────────────────────────────────
const SongDetails: FC<{ isMobile?: boolean }> = memo(() => {
  const currentTrack = useAppSelector((state) => {
    const { tracks, currentTrackId } = state.localPlayer;
    return tracks.find((t) => t.id === currentTrackId) ?? null;
  });

  if (!currentTrack) {
    return <div className='mobile-hidden' style={{ minWidth: 295 }} />;
  }

  return (
    <div className='flex flex-row items-center playing-container'>
      <div style={{ marginRight: 15 }}>
        <div
          className='playing-cover-container'
          style={{
            width: 56,
            height: 56,
            borderRadius: 4,
            overflow: 'hidden',
            background: '#282828',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {currentTrack.coverUrl ? (
            <img
              alt='Album Cover'
              className='album-cover'
              src={currentTrack.coverUrl}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <MusicNoteSvg />
          )}
        </div>
      </div>

      <div id='song-and-artist-name'>
        <p className='text-white font-bold song-title' title={currentTrack.name}>
          {currentTrack.name}
        </p>
        <span className='text-gray-200 song-artist' title={currentTrack.artist}>
          {currentTrack.artist}
        </span>
      </div>
    </div>
  );
});

export default SongDetails;
