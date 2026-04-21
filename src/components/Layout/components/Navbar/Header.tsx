import { useCallback } from 'react';

import { Space } from 'antd';
import { Link } from 'react-router-dom';

// Redux
import { authActions } from '../../../../store/slices/auth';
import { useAppDispatch, useAppSelector } from '../../../../store/store';

// Constants
import { ARTISTS_DEFAULT_IMAGE } from '../../../../constants/spotify';
import useIsMobile from '../../../../utils/isMobile';

const LogoutButton = () => {
  const dispatch = useAppDispatch();

  const handleLogout = useCallback(() => {
    localStorage.removeItem('peytotoria_user');
    dispatch(authActions.logout());
  }, [dispatch]);

  return (
    <button
      className='transparent-button'
      style={{ fontSize: '0.8rem', padding: '5px 16px' }}
      onClick={handleLogout}
    >
      Log Out
    </button>
  );
};

const Header = ({ opacity }: { opacity: number; title?: string }) => {
  const isMobile = useIsMobile();

  const user = useAppSelector(
    (state) => state.auth.user,
    (prev, next) => prev?.id === next?.id
  );

  return (
    <div
      className={`flex r-0 w-full flex-row items-center justify-between bg-gray-900 rounded-t-md z-10`}
      style={{ backgroundColor: `rgba(12, 12, 12, ${opacity}%)` }}
    >
      <div className='flex flex-row items-center'>
        <Space>
          {user ? (
            <div className='flex items-center gap-3'>
              {!isMobile && (
                <Link to={`/users/${user.id}`} style={{ textDecoration: 'none' }}>
                  <div className='avatar-container' style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <img
                      className='avatar'
                      id='user-avatar'
                      alt='User Avatar'
                      style={{ marginTop: -1 }}
                      src={
                        user.images && user.images.length
                          ? user.images[0].url
                          : ARTISTS_DEFAULT_IMAGE
                      }
                    />
                    <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 700 }}>
                      {user.display_name}
                    </span>
                  </div>
                </Link>
              )}
              <LogoutButton />
            </div>
          ) : null}
        </Space>
      </div>
    </div>
  );
};

export default Header;
