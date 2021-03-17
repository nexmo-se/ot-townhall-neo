// @flow
import React from "react";
import clsx from "clsx";
import posed from "react-pose";
import useStyles from "./styles";
import { BaseProps } from "./types";


import Loader from "react-spinners/BounceLoader";
import CycleCamera from "./components/CycleCamera";
import Hangup from "./components/Hangup";
import Mute from "./components/Mute";
import Video from "./components/Video";

interface ControlButtonProps extends BaseProps {}

function ControlButton(props: ControlButtonProps) {
  const { 
    size = 50, 
    fontSize = 24, 
    loading, 
    active, 
    onClick, 
    className, 
    children, 
    ...otherProps 
  } = props

  const [isBig, setIsBig] = React.useState(false);
  const mStyles = useStyles({ size, fontSize });

  const Container = posed.div({
    big: { scale: 1.1 },
    small: { scale: 1 }
  });

  const handleMouseEnter = () => setIsBig(true);
  const handleMouseLeave = () => setIsBig(false);
  const handleClick = () => {
    if (onClick) onClick();
  }

  return (
    <Container 
      {...otherProps}
      pose={isBig? "big": "small"} 
      className={
        clsx({
          [className]: true,
          [otherProps.forceColor]: !!otherProps.forceColor,
          "Vlt-white": true,
          "Vlt-bg-green": (active && !loading) && !otherProps.forceColor,
          "Vlt-bg-red": (!active && !loading) && !otherProps.forceColor,
          "Vlt-bg-grey": (loading || otherProps.disabled) && !otherProps.forceCOlor,
          [mStyles.icon]: true,
        })
      }
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave} 
      onClick={handleClick}
      disabled={loading || otherProps.disabled}
    >
      {loading? <Loader size={fontSize} color="white" />: children}
    </Container>
  )
}

ControlButton.CycleCamera = CycleCamera;
ControlButton.Hangup = Hangup;
ControlButton.Mute = Mute;
ControlButton.Video = Video;
export default ControlButton;