import { useState } from 'react';
import React from 'react';
import { IconButton } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import useMessage from 'hooks/message';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import EmojiEmotions from '@material-ui/icons/EmojiEmotions';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import useStyles from "./styles";

function ReactionsButton({ room, ...props }) {
  const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { sendEmoji } = useMessage();

  const mStyles = useStyles();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Tooltip title={<p style={{ fontSize: 16, color: 'white', margin: 0 }}>Add reaction</p>}>
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          className={mStyles.toolbarButtons}
          onClick={handleClick}
        >
        <EmojiEmotions
          style={{ fontSize: 32 }} 
        />
        </IconButton>
      </Tooltip>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '10ch',
            marginLeft: '52px',
          },
        }}
      >
        <MenuItem
          // className={layOut === 'grid' ? localClasses.choosen : null}
          onClick={() => {
            sendEmoji('thumbsup');

          }}
        >
          <Typography variant="inherit">
            <ThumbUpAltIcon
            style={props} 
            />
          </Typography>
        </MenuItem>
        <MenuItem
          // className={layOut === 'active-speaker' ? localClasses.choosen : null}
          onClick={() => {
            sendEmoji('thumbsdown');

          }}
        >
          <Typography variant="inherit">
            <ThumbDownAltIcon
            style={props} 
            />
          </Typography>
        </MenuItem>
        <MenuItem
          // className={layOut === 'active-speaker' ? localClasses.choosen : null}
          onClick={() => {
            sendEmoji('love');
          }}
        >
          <Typography variant="inherit">
            <FavoriteIcon
            style={props} 
            />
          </Typography>
        </MenuItem>
      </Menu>
    </div>
  );
}

ReactionsButton.defaultProps = { fontSize: 20 }
export default ReactionsButton;
