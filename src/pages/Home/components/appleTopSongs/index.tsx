import { FC, memo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import { localPlayerActions } from '../../../../store/slices/localPlayer';
import { audioPlayer } from '../../../../utils/audioPlayer';
import type { AppleMusicTrack } from '../../../../services/appleMusic';

const formatMs = (ms: number) => {
  if (!ms) return '—';
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

const TrackRow: FC<{ track: AppleMusicTrack; index: number; isPlaying: boolean; isCurrent: boolean }> = memo(
  ({ track, index, isPlaying, isCurrent }) => {
    const dispatch = useAppDispatch();

    const handlePlay = () => {
      if (!track.previewUrl) return;
      const localTrack = {
        id: `apple_${track.id}`,
        name: track.title,
        artist: track.artist,
        album: track.album,
        artworkUrl: track.artworkUrl,
        url: track.previewUrl,
        durationMs: track.durationMs,
      };
      dispatch(localPlayerActions.setQueue({ tracks: [localTrack], startIndex: 0 }));
      audioPlayer.playTrack(localTrack, () => {
        dispatch(localPlayerActions.setIsPlaying(false));
      });
      dispatch(localPlayerActions.setIsPlaying(true));
    };

    return (
      <div
        className={`apple-track-row ${isCurrent ? 'apple-track-row--active' : ''}`}
        onClick={handlePlay}
        role='button'
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handlePlay()}
        aria-label={`Play ${track.title} by ${track.artist}`}
      >
        <div className='apple-track-row__num'>
          {isCurrent && isPlaying ? (
            <span className='apple-eq-icon' aria-hidden='true'>
              <span /><span /><span />
            </span>
          ) : (
            <span className='apple-track-row__index'>{index + 1}</span>
          )}
        </div>
        <img
          src={track.artworkUrl}
          alt={track.album}
          className='apple-track-row__art'
          loading='lazy'
        />
        <div className='apple-track-row__info'>
          <span className='apple-track-row__title'>{track.title}</span>
          <span className='apple-track-row__artist'>{track.artist}</span>
        </div>
        <span className='apple-track-row__duration'>{formatMs(track.durationMs)}</span>
        {track.previewUrl ? (
          <span className='apple-track-row__preview' title='30s preview available'>▶</span>
        ) : (
          <a
            href={track.appleMusicUrl}
            target='_blank'
            rel='noreferrer'
            className='apple-track-row__link'
            onClick={(e) => e.stopPropagation()}
            title='Open in Apple Music'
          >
            <svg viewBox='0 0 24 24' fill='currentColor' width='14' height='14' aria-hidden='true'>
              <path d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z' />
            </svg>
          </a>
        )}
      </div>
    );
  }
);

export const AppleTopSongs: FC = () => {
  const topSongs = useAppSelector((state) => state.appleMusicHome.topSongs);
  const loading = useAppSelector((state) => state.appleMusicHome.loading);
  const currentId = useAppSelector((state) => state.localPlayer.currentTrack?.id);
  const isPlaying = useAppSelector((state) => state.localPlayer.isPlaying);

  if (loading) {
    return (
      <div className='home'>
        <h1 className='playlist-header'>Top Songs on Apple Music</h1>
        <div className='apple-tracks-skeleton'>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className='apple-track-skeleton' />
          ))}
        </div>
      </div>
    );
  }

  if (!topSongs.length) return null;

  return (
    <div className='home'>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <svg viewBox='0 0 24 24' fill='#fa2d48' width='22' height='22' aria-hidden='true'>
          <path d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z' />
        </svg>
        <h1 className='playlist-header' style={{ margin: 0 }}>Top Songs on Apple Music</h1>
      </div>
      <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: 16, marginTop: 2 }}>
        30-second previews — click to play
      </p>
      <div className='apple-tracks-list'>
        {topSongs.map((track, i) => (
          <TrackRow
            key={track.id}
            track={track}
            index={i}
            isCurrent={currentId === `apple_${track.id}`}
            isPlaying={isPlaying}
          />
        ))}
      </div>
    </div>
  );
};
