import YourLibrary from './list';
import { UploadTrackButton } from './UploadTrack';

// Redux
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import { yourLibraryActions } from '../../../../store/slices/yourLibrary';

// Interfaces
import { useEffect, type FC } from 'react';

interface LibraryProps {}

export const Library: FC<LibraryProps> = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => !!state.auth.user);

  useEffect(() => {
    // Skip Spotify API calls — no token available
  }, [user, dispatch]);

  return (
    <div style={{ height: '100%' }}>
      <YourLibrary />
      {user && <UploadTrackButton />}
    </div>
  );
};

export default Library;
