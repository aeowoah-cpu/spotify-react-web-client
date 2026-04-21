// Components
import { Col } from 'antd';
import { LibraryTitle } from '../Title';
import { ListItemComponent } from './ListCards';
import { CompactItemComponent } from './CompactCards';
import { LibraryFilters, SearchArea } from '../Filters';

// Redux
import { useAppDispatch, useAppSelector } from '../../../../../store/store';
import { getLibraryItems } from '../../../../../store/slices/yourLibrary';
import { GridItemComponent } from '../../../../Lists/list';
import { memo, useMemo } from 'react';
import { isActiveOnOtherDevice } from '../../../../../store/slices/spotify';
import useIsMobile from '../../../../../utils/isMobile';
import { getLibraryCollapsed, uiActions } from '../../../../../store/slices/ui';
import { LanguageButton } from '../Language';
import { LibraryLoginInfo } from './loginInfo';
import { Link, useLocation } from 'react-router-dom';

const COLLAPSED_STYLE = {
  overflowY: 'scroll',
  height: '100%',
} as const;

const YourLibrary = () => {
  const collapsed = useAppSelector(getLibraryCollapsed);
  const user = useAppSelector((state) => !!state.auth.user);
  const activeOnOtherDevice = useAppSelector(isActiveOnOtherDevice);

  const heightValue = useMemo(() => {
    let value = 310;
    if (!user) value = 270;
    if (collapsed) value = 218;
    if (activeOnOtherDevice) value += 50;
    return value;
  }, [user, collapsed, activeOnOtherDevice]);

  return (
    <div className={`Navigation-section library ${!collapsed ? 'open' : ''}`}>
      <LibraryTitle />

      {!collapsed && user ? <LibraryFilters /> : null}

      <div className='library-list-container'>
        <Col style={collapsed ? {} : COLLAPSED_STYLE}>
          <div
            className='library-list'
            style={{
              overflowY: 'scroll',
              overflowX: 'hidden',
              height: `calc(100vh - ${heightValue}px`,
            }}
          >
            {!user ? <AnonymousContent /> : <LoggedContent />}
          </div>

          {!user ? (
            <div style={{ marginLeft: 10 }}>
              <LanguageButton />
            </div>
          ) : null}
        </Col>
      </div>
    </div>
  );
};

const AnonymousContent = () => {
  return <LibraryLoginInfo />;
};

const MyMusicLink = memo(() => {
  const location = useLocation();
  const collapsed = useAppSelector(getLibraryCollapsed);
  const isActive = location.pathname === '/my-music';
  const trackCount = useAppSelector((state) => state.localPlayer.tracks.length);

  if (collapsed) {
    return (
      <Link to='/my-music' title='My Music' style={{ textDecoration: 'none' }}>
        <div
          className='library-card collapsed'
          data-active={isActive}
          style={{ borderRadius: 10, display: 'flex', justifyContent: 'center' }}
        >
          <div className='image-container' style={{ padding: 8 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 6,
                background: '#1a3a2a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg viewBox='0 0 24 24' fill='#1db954' width='28' height='28'>
                <path d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z' />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to='/my-music' style={{ textDecoration: 'none' }}>
      <button className='library-card' data-active={isActive} style={{ borderRadius: 10 }}>
        <div className='image p-2 h-full items-center'>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 6,
              background: '#1a3a2a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg viewBox='0 0 24 24' fill='#1db954' width='28' height='28'>
              <path d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z' />
            </svg>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div id='playlist-song-and-artist-name'>
            <h3
              style={{
                fontSize: 15,
                marginBottom: -5,
                color: isActive ? '#1db954' : '#fff',
                fontWeight: 100,
              }}
            >
              My Music
            </h3>
            <p style={{ fontSize: 13, opacity: 0.7, fontWeight: 400, color: '#fff' }}>
              {trackCount} {trackCount === 1 ? 'track' : 'tracks'}
            </p>
          </div>
        </div>
      </button>
    </Link>
  );
});

const LoggedContent = memo(() => {
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();
  const items = useAppSelector(getLibraryItems);
  const collapsed = useAppSelector(getLibraryCollapsed);
  const view = useAppSelector((state) => state.yourLibrary.view);

  return (
    <>
      {!collapsed ? <SearchArea /> : null}

      {/* My Music shortcut always at top */}
      <MyMusicLink />

      <div
        className={`${collapsed ? 'collapsed' : ''} ${
          !collapsed && view === 'GRID' ? 'grid-view' : ''
        }`}
      >
        {items.map((item) => {
          if (collapsed) return <ListItemComponent key={item.id} item={item} />;

          return (
            <div
              key={item.id}
              onClick={isMobile ? () => dispatch(uiActions.collapseLibrary()) : undefined}
            >
              {view === 'LIST' ? <ListItemComponent key={item.id} item={item} /> : ''}
              {view === 'COMPACT' ? <CompactItemComponent key={item.id} item={item} /> : ''}
              {view === 'GRID' ? <GridItemComponent key={item.id} item={item} /> : ''}
            </div>
          );
        })}
      </div>
    </>
  );
});

export default YourLibrary;
