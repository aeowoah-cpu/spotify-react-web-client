import { useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import { localPlayerActions, LocalTrack } from '../../../../store/slices/localPlayer';
import { getLibraryCollapsed } from '../../../../store/slices/ui';
import { Tooltip } from '../../../Tooltip';
import { useTranslation } from 'react-i18next';

const UploadIcon = () => (
  <svg viewBox='0 0 24 24' fill='currentColor' width='16' height='16'>
    <path d='M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z' />
  </svg>
);

export const UploadTrackButton = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['navbar']);
  const collapsed = useAppSelector(getLibraryCollapsed);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('audio/')) continue;
      const url = URL.createObjectURL(file);

      // Extract duration via AudioContext
      const duration = await new Promise<number>((resolve) => {
        const audio = new Audio();
        audio.addEventListener('loadedmetadata', () => {
          resolve(Math.floor(audio.duration * 1000));
          URL.revokeObjectURL(audio.src); // safe – we already have `url` from createObjectURL on the original file
        });
        audio.addEventListener('error', () => resolve(0));
        audio.src = url;
      });

      // Parse name/artist from filename: "Artist - Title.mp3" or just "Title.mp3"
      const baseName = file.name.replace(/\.[^.]+$/, '');
      const parts = baseName.split(' - ');
      const name = parts.length >= 2 ? parts.slice(1).join(' - ').trim() : baseName.trim();
      const artist = parts.length >= 2 ? parts[0].trim() : 'Unknown Artist';

      const track: LocalTrack = {
        id: `track_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        name,
        artist,
        album: 'My Music',
        duration: duration || 0,
        url,
      };

      dispatch(localPlayerActions.addTrack(track));
    }
  };

  if (collapsed) {
    return (
      <>
        <Tooltip placement='right' title='Upload Music'>
          <button
            className='library-upload-btn-collapsed'
            onClick={() => inputRef.current?.click()}
            aria-label='Upload music files'
          >
            <UploadIcon />
          </button>
        </Tooltip>
        <input
          ref={inputRef}
          type='file'
          accept='audio/*'
          multiple
          style={{ display: 'none' }}
          onChange={(e) => handleFiles(e.target.files)}
          onClick={(e) => ((e.target as HTMLInputElement).value = '')}
        />
      </>
    );
  }

  return (
    <>
      <button
        className='library-upload-btn'
        onClick={() => inputRef.current?.click()}
        aria-label='Upload music files'
      >
        <UploadIcon />
        <span>Upload Music</span>
      </button>
      <input
        ref={inputRef}
        type='file'
        accept='audio/*'
        multiple
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
        onClick={(e) => ((e.target as HTMLInputElement).value = '')}
      />
    </>
  );
};
