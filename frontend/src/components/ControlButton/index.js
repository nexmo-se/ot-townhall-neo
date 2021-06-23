// @flow
import React from "react";
import clsx from "clsx";
import lodash from "lodash";
import useStyles from "./styles";
import { BaseProps } from "./types";


import Loader from "react-spinners/BounceLoader";
import Tooltip from "components/Tooltip";
import CycleCamera from "./components/CycleCamera";
import Hangup from "./components/Hangup";
import Mute from "./components/Mute";
import Video from "./components/Video";

interface ControlButtonProps extends BaseProps {
  tooltip: string;
}

function ControlButton(props: ControlButtonProps) {
  const { 
    size = 50,
    fontSize = 24,
    loading,
    active,
    onClick,
    className,
    children,
    tooltip,
    ...otherProps 
  } = props

  const [isBig, setIsBig] = React.useState(false);
  const mStyles = useStyles({ size, fontSize });

  const handleMouseEnter = () => setIsBig(true);
  const handleMouseLeave = () => setIsBig(false);
  const handleClick = () => {
    if (onClick) onClick();
  }

  return (
    <div 
      {...otherProps}
      className={
        clsx({
          [className]: true,
          [otherProps.forceColor]: !!otherProps.forceColor,
          "Vlt-white": true,
          "Vlt-bg-green": (active && !loading) && !otherProps.forceColor,
          "Vlt-bg-red": (!active && !loading) && !otherProps.forceColor,
          "Vlt-bg-grey": (loading || otherProps.disabled) && !otherProps.forceColor,
          [mStyles.icon]: true,
        })
      }
      style={{
        zIndex: (isBig)? 9999: 1,
        ...otherProps.style
      }}
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave} 
      onClick={lodash.debounce(handleClick, 3000, { leading: true, trailing: false })}
      disabled={loading || otherProps.disabled}
    >
      {
        loading
        ? <Loader size={fontSize} color="white" />
        : (
          <Tooltip title={tooltip}>
            <div style={{ zIndex: 99999 }}>
              {children}
            </div>
          </Tooltip>
        )
      }
    </div>
  )
}

ControlButton.CycleCamera = CycleCamera;
ControlButton.Hangup = Hangup;
ControlButton.Mute = Mute;
ControlButton.Video = Video;
export default ControlButton;