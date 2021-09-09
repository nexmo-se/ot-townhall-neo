import AudioButton from "../AudioButton";
import VideoButton from "../VideoButton";
import MediaButton from "../MediaButton";

function MediaControl () {
}

MediaControl.MediaButton = MediaButton;
MediaControl.AudioButton = AudioButton;
MediaControl.VideoButton = VideoButton;
export default MediaControl;