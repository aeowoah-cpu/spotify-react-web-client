// Components
import { Col, Row } from 'antd';
import { HomeHeader } from './header';
import { TopTracks } from '../components/topTracks';
import { MadeForYou } from '../components/madeForYou';
import { NewReleases } from '../components/newReleases';
import { FeaturePlaylists } from '../components/featurePlaylists';
import { AppleTopSongs } from '../components/appleTopSongs';
import { AppleNewReleases } from '../components/appleNewReleases';

// Utils
import { FC, memo, RefObject, useRef, useState } from 'react';
import { RecentlyPlayed } from '../components/recentlyPlayed';
import { TopMixes } from '../components/topMixes';
import { useAppSelector } from '../../../store/store';
import { Rankings } from '../components/rankings';
import { Trending } from '../components/trending';
import { FavouriteArtists } from '../components/favouriteArtists';
import { YourPlaylists } from '../components/yourPlaylists';
import useIsMobile from '../../../utils/isMobile';

interface HomePageContainerProps {
  container: RefObject<HTMLDivElement | null>;
}

const HomePageContainer: FC<HomePageContainerProps> = memo((props) => {
  const { container } = props;
  const [color, setColor] = useState('rgb(66, 32, 35)');

  const isMobile = useIsMobile();
  const sectionContainerRef = useRef<HTMLDivElement>(null);
  const user = useAppSelector((state) => !!state.auth.user);
  const section = useAppSelector((state) => state.home.section);

  return (
    <div ref={sectionContainerRef}>
      <HomeHeader color={color} container={container} sectionContainer={sectionContainerRef} />
      <div
        className='Home-seccion'
        style={{
          paddingTop: isMobile ? 50 : 0,
          transition: 'background: 5s',
          background: `linear-gradient(180deg, ${color} 2%, rgb(18, 18, 18) 18%)`,
        }}
      >
        <Row gutter={[16, 16]}>
          {/* Apple Music — always visible, no token needed */}
          <Col span={24}>
            <AppleTopSongs />
          </Col>

          <Col span={24}>
            <AppleNewReleases />
          </Col>

          {/* Legacy Spotify-backed sections — rendered only when Spotify data is available */}
          {user ? (
            <Col span={24}>
              <TopTracks setColor={setColor} />
            </Col>
          ) : null}

          {user && section === 'ALL' ? (
            <Col span={24}>
              <RecentlyPlayed />
            </Col>
          ) : null}
        </Row>
      </div>
    </div>
  );
});

export default HomePageContainer;
