import { useState, useRef } from 'react';
import React from "react";

import ControlButton from "components/ControlButton";
import ShareScreenIcon from '@material-ui/icons/ScreenShare';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const contentHints = [
  { id: "none", value: "", display: "None" },
  { id: "motion", value: "motion", display: "Motion" },
  { id: "detail", value: "detail", display: "Detail" },
  { id: "text", value: "text", display: "Text" }
]

function ShareScreenButton({ isSharing, ...props }){
  const [open, setOpen] = useState(null);
  const { screenShareClick, videoHoverVisible } = props
  const inputEl = useRef(null);

  const handleClick = (event) => {
    if (isSharing) {
      screenShareClick()
    }
    else {
      setOpen((prev) => !prev);
    }
  };

  const handleClose = () => {
    setOpen(null);
  };

  React.useEffect(() => {
    if (videoHoverVisible == false && open) {
      setOpen(null);
    }
  }, [videoHoverVisible, open])

  return (
    <>
    <ControlButton 
      active={isSharing}
      tooltip={isSharing? "Stop Sharing": "Share Screen"}
      {...props}
      onClick={handleClick}
    >
      <ShareScreenIcon fontSize="inherit" ref={inputEl}/>
      <Menu
        id="content-hint-menu"
        anchorEl={inputEl.current}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            marginTop: '8px',
            marginLeft: '36px'
          }
        }}
      >
        <p style={{padding: '0px 8px', fontSize: '12px'}}><strong>Content Hint</strong></p>
        {
          contentHints.map((contentHint) => (
            <MenuItem
            key={contentHint.id}
            onClick={() => {
              screenShareClick(contentHint.value);
            }}
          >
            {contentHint.display}
          </MenuItem>
          ))
        }
      </Menu>
    </ControlButton>
    </>
  )
}

ShareScreenButton.defaultProps = { size: 50, fontSize: 24 }
export default ShareScreenButton;