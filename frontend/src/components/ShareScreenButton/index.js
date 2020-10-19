import React from "react";
import posed from "react-pose";
import clsx from "clsx";
import useStyles from "./styles";

import ShareScreenIcon from '@material-ui/icons/ScreenShare';

function ShareScreenButton({ onClick, size, fontSize, style, isSharing }){
  const [ isBig, setIsBig ] = React.useState(false);
  const mStyles = useStyles({ size, fontSize });

  const Container = posed.div({
    big: { scale: 1.1 },
    small: { scale: 1 }
  });

  const handleMouseEnter = () => setIsBig(true);
  const handleMouseLeave = () => setIsBig(false);
  const handleClick = () => {
    if(onClick) onClick();
  }

  return (
    <Container 
      pose={isBig? "big": "small"} 
      className={clsx({
        "Vlt-bg-green": isSharing,
        "Vlt-bg-red": !isSharing,
        "Vlt-white": true,
        [mStyles.hangup]: true
      })}
      style={{ ...style }}
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave} 
      onClick={handleClick}
    >
      <ShareScreenIcon fontSize="inherit" />  
    </Container>
  )
}

ShareScreenButton.defaultProps = { size: 50, fontSize: 24 }
export default ShareScreenButton;