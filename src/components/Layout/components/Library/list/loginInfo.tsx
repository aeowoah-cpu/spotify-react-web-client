import { memo } from 'react';
import { Link } from 'react-router-dom';

export const LibraryLoginInfo = memo(() => {
  return (
    <div style={{ padding: '16px 12px', color: '#b3b3b3', fontSize: '0.85rem' }}>
      <p style={{ fontWeight: 700, color: '#fff', marginBottom: 6 }}>Your Library</p>
      <p>Upload your music to start listening.</p>
      <div style={{ marginTop: 16 }}>
        <Link
          to='/my-music'
          style={{
            display: 'inline-block',
            padding: '8px 16px',
            borderRadius: 9999,
            background: '#1db954',
            color: '#000',
            fontWeight: 700,
            fontSize: '0.8rem',
            textDecoration: 'none',
          }}
        >
          Go to My Music
        </Link>
      </div>
    </div>
  );
});
