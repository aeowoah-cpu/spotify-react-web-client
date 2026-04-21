import { useEffect, useState } from 'react';

// Components
import { Space } from 'antd';
import { Slider } from '../../../Slider';
import { Tooltip } from '../../../Tooltip';
import { VolumeIcon, VolumeMuteIcon, VolumeOneIcon, VolumeTwoIcon } from '../../../Icons';

// I18n
import { useTranslation } from 'react-i18next';

// Audio
import { audioPlayer } from '../../../../utils/audioPlayer';

// Redux
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import { localPlayerActions } from '../../../../store/slices/localPlayer';

const getIcon = (volume: number) => {
  if (volume === 0) return <VolumeMuteIcon />;
  if (volume < 0.4) return <VolumeOneIcon />;
  if (volume < 0.7) return <VolumeTwoIcon />;
  return <VolumeIcon />;
};

export const VolumeControls = () => {
  const { t } = useTranslation(['playingBar']);
  const dispatch = useAppDispatch();
  const storeVolume = useAppSelector((state) => state.localPlayer.volume);
  const [volume, setVolume] = useState<number>(storeVolume);
  const [prevVolume, setPrevVolume] = useState<number>(storeVolume || 1);

  useEffect(() => {
    setVolume(storeVolume);
  }, [storeVolume]);

  const muted = volume === 0;

  const handleMuteToggle = () => {
    const newVol = muted ? prevVolume : 0;
    if (!muted) setPrevVolume(volume);
    setVolume(newVol);
    audioPlayer.setVolume(newVol);
    dispatch(localPlayerActions.setVolume(newVol));
  };

  return (
    <div className='volume-control-container'>
      <Space style={{ display: 'flex' }}>
        <Tooltip title={muted ? t('Unmute') : t('Mute')}>
          <div onClick={handleMuteToggle}>{getIcon(volume)}</div>
        </Tooltip>

        <div className='flex items-center justify-between w-full' style={{ width: 90 }}>
          <Slider
            isEnabled
            value={muted ? 0 : volume}
            onChange={(v) => setVolume(v)}
            onChangeEnd={(v) => {
              setVolume(v);
              audioPlayer.setVolume(v);
              dispatch(localPlayerActions.setVolume(v));
            }}
          />
        </div>
      </Space>
    </div>
  );
};

export default VolumeControls;
