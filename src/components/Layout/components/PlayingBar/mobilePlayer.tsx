import SongDetails from './SongDetails';
import { useAppSelector } from '../../../../store/store';
import { Col, Row } from 'antd';
import { ListIcon, Pause, Play } from '../../../Icons';

// Redux + Audio
import { audioPlayer } from '../../../../utils/audioPlayer';
import { uiActions } from '../../../../store/slices/ui';
import { useAppDispatch } from '../../../../store/store';

const PlayButton = () => {
  const isPlaying = useAppSelector((state) => state.localPlayer.isPlaying);
  return (
    <button onClick={() => (isPlaying ? audioPlayer.pause() : audioPlayer.play())}>
      {isPlaying ? <Pause /> : <Play />}
    </button>
  );
};

const QueueButton = () => {
  const dispatch = useAppDispatch();
  return (
    <button onClick={() => dispatch(uiActions.toggleQueue())}>
      <ListIcon />
    </button>
  );
};

const NowPlayingBarMobile = () => {
  const position = useAppSelector((state) => state.localPlayer.position);
  const duration = useAppSelector((state) => state.localPlayer.duration);
  const currentTrack = useAppSelector((state) => {
    const { tracks, currentTrackId } = state.localPlayer;
    return tracks.find((t) => t.id === currentTrackId) ?? null;
  });

  if (!currentTrack) return <div />;

  return (
    <div>
      <div
        className='mobile-player'
        style={{ background: 'linear-gradient(#1a3a2a -50%, rgb(18, 18, 18) 300%)' }}
      >
        <Row justify='space-between'>
          <Col>
            <SongDetails isMobile />
          </Col>
          <Col style={{ display: 'flex' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                minWidth: 50,
                marginRight: 5,
                gap: 15,
                justifyContent: 'space-between',
              }}
            >
              <QueueButton />
              <PlayButton />
            </div>
          </Col>
        </Row>
        <div className='time-line'>
          <div
            className='current-time'
            style={{ width: duration > 0 ? `${(position / duration) * 100}%` : '0%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default NowPlayingBarMobile;
