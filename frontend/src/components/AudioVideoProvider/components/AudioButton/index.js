import { useAudioVideo } from "../../hooks/audio-video";
import MediaButton from "../MediaButton";

function AudioButton () {
  const { hasAudio, setHasAudio } = useAudioVideo();

  function handleClick () {
    setHasAudio((prev) => !prev);
  }

  function generateIconName () {
    if (hasAudio) {
      return "Vlt-icon-microphone-full"
    } else {
      return "Vlt-icon-microphone-mute-full"
    }
  }

  function generateIconColor () {
    if (hasAudio) return "green";
    else return "red";
  }

  function generateTooltip () {
    if (hasAudio) return "Mute Microphone"
    else return "Unmute Microphone"
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

export default AudioButton;