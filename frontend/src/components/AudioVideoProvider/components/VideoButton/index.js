import { useAudioVideo } from "../../hooks/audio-video";
import MediaButton from "../MediaButton";

function VideoButton () {
  const { hasVideo, setHasVideo } = useAudioVideo();

  function handleClick () {
    setHasVideo((prev) => !prev);
  }

  function generateIconName () {
    if (hasVideo) {
      return "Vlt-icon-video-active-full"
    } else {
      return "Vlt-icon-video-off-full"
    }
  }

  function generateIconColor () {
    if (hasVideo) return "green";
    else return "red";
  }

  function generateTooltip () {
    if (hasVideo) return "Enable Video";
    else return "Disable Video";
  }

  return (
    <MediaButton
      iconName={generateIconName()}
      iconColor={generateIconColor()}
      tooltip={generateTooltip()}
      onClick={handleClick}
    />
  )
}

export default VideoButton;