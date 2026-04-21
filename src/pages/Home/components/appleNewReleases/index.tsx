import { FC, memo } from 'react';
import { useAppSelector } from '../../../../store/store';
import type { AppleMusicAlbum } from '../../../../services/appleMusic';

const AlbumCard: FC<{ album: AppleMusicAlbum }> = memo(({ album }) => (
  <a
    href={album.appleMusicUrl}
    target='_blank'
    rel='noreferrer'
    className='apple-album-card'
    title={`${album.title} — open in Apple Music`}
  >
    <div className='apple-album-card__art-wrap'>
      <img
        src={album.artworkUrl}
        alt={album.title}
        className='apple-album-card__art'
        loading='lazy'
      />
      <div className='apple-album-card__overlay'>
        <svg viewBox='0 0 24 24' fill='#fff' width='20' height='20' aria-hidden='true'>
          <path d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z' />
        </svg>
        <span>Apple Music</span>
      </div>
    </div>
    <p className='apple-album-card__title'>{album.title}</p>
    <p className='apple-album-card__artist'>{album.artist}</p>
  </a>
));

export const AppleNewReleases: FC = () => {
  const newReleases = useAppSelector((state) => state.appleMusicHome.newReleases);

  if (!newReleases.length) return null;

  return (
    <div className='home'>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <svg viewBox='0 0 24 24' fill='#fa2d48' width='22' height='22' aria-hidden='true'>
          <path d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z' />
        </svg>
        <h1 className='playlist-header' style={{ margin: 0 }}>New Releases on Apple Music</h1>
      </div>
      <div className='apple-albums-grid'>
        {newReleases.slice(0, 12).map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </div>
    </div>
  );
};
