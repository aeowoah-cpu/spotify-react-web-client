// Components
import { Col, Row } from 'antd';
import VolumeControls from './Volume';
import { Tooltip } from '../../../Tooltip';

// Icons
import { ListIcon } from '../../../Icons';

// I18n
import { useTranslation } from 'react-i18next';

// Redux
import { uiActions } from '../../../../store/slices/ui';
import { useAppDispatch, useAppSelector } from '../../../../store/store';

const QueueButton = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['playingBar']);
  const queueCollapsed = useAppSelector((state) => state.ui.queueCollapsed);
  return (
    <Tooltip title={t('Queue')}>
      <button
        onClick={() => dispatch(uiActions.toggleQueue())}
        className={!queueCollapsed ? 'active-icon-button' : ''}
        style={{ marginLeft: 10, marginRight: 5, cursor: 'pointer' }}
      >
        <ListIcon active={!queueCollapsed} />
      </button>
    </Tooltip>
  );
};

const ExtraControlButtons = () => {
  return (
    <div>
      <Row gutter={18} align='middle'>
        <QueueButton />

        <Col>
          <VolumeControls />
        </Col>
      </Row>
    </div>
  );
};

export default ExtraControlButtons;
