// @flow
import React from 'react';
import clsx from 'clsx';
import useStyles from './styles';
import User from 'entities/user';

import Avatar from 'components/Avatar';

type ChatBubbleProps = {
  name: string,
  message: string
};

function ChatBubble({ name, message }: ChatBubbleProps) {
  const [user] = React.useState<User>(new User({ name, role: 'unknown' }));
  const mStyles = useStyles();

  return (
    <div
      className={clsx(
        'Vlt-card',
        'Vlt-card--plain',
        'Vlt-card--lespadding',
        mStyles.root
      )}
    >
      <div
        className="Vlt-card__content"
        style={{ display: 'flex', flexDirection: 'row' }}
      >
        {/* <Avatar user={user} size={50} className={mStyles.avatar} /> */}
        <div className={mStyles.chat}>
          <p style={{ color: '#FFD700' }}>
            <b>{name}</b>
          </p>
          <p className={mStyles.message} style={{ color: '#91ffff' }}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
export default ChatBubble;
