import { Col, Row } from 'antd';
import { Pause, Play, Replay, ReplayOne, ShuffleIcon, SkipBack, SkipNext } from '../../../Icons';

// Redux
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import { localPlayerActions } from '../../../../store/slices/localPlayer';

// Audio
import { audioPlayer } from '../../../../utils/audioPlayer';
import { memo } from 'react';

const ShuffleButton = memo(() => {
  const dispatch = useAppDispatch();
  const shuffle = useAppSelector((state) => state.localPlayer.shuffle);
  return (
    <button onClick={() => dispatch(localPlayerActions.toggleShuffle())}>
      <ShuffleIcon active={shuffle} />
    </button>
  );
});

const SkipBackButton = memo(() => {
  const dispatch = useAppDispatch();
  const hasTracks = useAppSelector((state) => state.localPlayer.tracks.length > 0);
  return (
    <button
      className={!hasTracks ? 'disabled' : ''}
      onClick={() => hasTracks && dispatch(localPlayerActions.prev())}
    >
      <SkipBack />
    </button>
  );
});

const PlayButton = memo(() => {
  const isPlaying = useAppSelector((state) => state.localPlayer.isPlaying);
  const hasTrack = useAppSelector((state) => !!state.localPlayer.currentTrackId);

  return (
    <button
      className='player-pause-button'
      onClick={() => {
        if (!hasTrack) return;
        isPlaying ? audioPlayer.pause() : audioPlayer.play();
      }}
    >
      {isPlaying ? <Pause /> : <Play />}
    </button>
  );
});

const SkipNextButton = memo(() => {
  const dispatch = useAppDispatch();
  const hasTracks = useAppSelector((state) => state.localPlayer.tracks.length > 0);
  return (
    <button
      className={!hasTracks ? 'disabled' : ''}
      onClick={() => hasTracks && dispatch(localPlayerActions.next())}
    >
      <SkipNext />
    </button>
  );
});

const ReplayButton = memo(() => {
  const dispatch = useAppDispatch();
  const repeat = useAppSelector((state) => state.localPlayer.repeat);
  return (
    <button
      className={repeat !== 'off' ? 'active-icon-button' : ''}
      onClick={() => dispatch(localPlayerActions.toggleRepeat())}
    >
      {repeat === 'track' ? <ReplayOne active /> : <Replay active={repeat === 'all'} />}
    </button>
  );
});

const CONTROLS = [ShuffleButton, SkipBackButton, PlayButton, SkipNextButton, ReplayButton];

const ControlButtons = () => {
  return (
    <Row gutter={24} align='middle' style={{ justifyContent: 'center' }}>
      {CONTROLS.map((Component, index) => (
        <Col key={index}>
          <Component />
        </Col>
      ))}
    </Row>
  );
};

export default ControlButtons;
