// Utils
import { FC, memo, RefObject, useEffect } from 'react';

// Components
import HomePageContainer from './container';

// Redux
import { useAppDispatch, useAppSelector } from '../../store/store';
import { appleMusicHomeActions } from '../../store/slices/appleMusicHome';

interface HomeProps {
  container: RefObject<HTMLDivElement | null>;
}

const Home: FC<HomeProps> = memo((props) => {
  const { container } = props;

  const dispatch = useAppDispatch();
  const topSongsLoaded = useAppSelector((state) => state.appleMusicHome.topSongs.length > 0);

  useEffect(() => {
    // Fetch Apple Music catalog data once on mount
    if (!topSongsLoaded) {
      dispatch(appleMusicHomeActions.fetchAppleTopSongs());
      dispatch(appleMusicHomeActions.fetchAppleNewReleases());
    }
  }, [dispatch, topSongsLoaded]);

  return <HomePageContainer container={container} />;
});

export default Home;
