/* eslint-disable react-hooks/exhaustive-deps */
// Components
import { Slider } from '../../../Slider';

// Utils
import { msToTime } from '../../../../utils';

// Redux
import { useAppSelector } from '../../../../store/store';
import { memo, useEffect, useState } from 'react';

// Audio
import { audioPlayer } from '../../../../utils/audioPlayer';

const SongProgressBar = memo(() => {
  const position = useAppSelector((state) => state.localPlayer.position);
  const duration = useAppSelector((state) => state.localPlayer.duration);
  const hasTrack = useAppSelector((state) => !!state.localPlayer.currentTrackId);

  const [value, setValue] = useState<number>(0);
  const [selecting, setSelecting] = useState<boolean>(false);

  useEffect(() => {
    if (duration && !selecting) {
      setValue(duration > 0 ? Math.min(position / duration, 1) : 0);
    }
  }, [position, duration, selecting]);

  return (
    <div className='flex items-center justify-between w-full'>
      <div className='text-white mr-2 text-xs'>{position ? msToTime(position) : '0:00'}</div>
      <div style={{ width: '100%' }}>
        <Slider
          isEnabled={hasTrack}
          value={value}
          onChangeStart={() => setSelecting(true)}
          onChange={(v) => setValue(v)}
          onChangeEnd={(v) => {
            setSelecting(false);
            if (!hasTrack || !duration) return;
            setValue(v);
            audioPlayer.seek(Math.round(duration * v));
          }}
        />
      </div>
      <div className='text-white ml-2 text-xs'>{duration ? msToTime(duration) : '0:00'}</div>
    </div>
  );
});

export default SongProgressBar;
