// @flow
import React from "react";
import FetchHelper from "helper/fetch";
import StreamHelper from "utils/stream-helper";
import User from "entities/user";
import lodash from "lodash";

import useStyles from "./styles";
import useVOD from "../../hooks/vod";
import usePublisher from "hooks/publisher";
import useSession from "hooks/session";
import useMe from "hooks/me";

import TheatersIcon from '@material-ui/icons/Theaters';
import ControlButton from "components/ControlButton";

interface IVODButton {
  size: number,
  fontSize: number,
  style?: any
}

function VODButton({ size, fontSize, ...props }: IVODButton){
  const [ isPublishing, setIsPublishing ] = React.useState<boolean>(false);
  const [ inputRef, setInputRef ] = React.useState<any>();
  const {
    setVideoSource,
    clearVideoSource,
    videoSource,
    videoRef
  } = useVOD();

  const mStyles = useStyles();
  const mMe = useMe();
  const { publish, unpublish } = usePublisher({ containerID: "cameraContainer", name: `${mMe.me?.name ?? ""}'s Video` });
  const { session } = useSession();

  function handleClick() {
    if (lodash.isEmpty(videoSource)) {
      if (inputRef) inputRef.click();
    } else {
      clearVideoSource()
      unpublish({ session });
    }
  }

  function handleFileChange(e){
    const [ selectedVideo ] = e.target.files;
    const videoURL = URL.createObjectURL(selectedVideo);
    setVideoSource(videoURL);
  }

  const preparePublish = React.useCallback(
    async () => {
      await videoRef.play();
      const videoStream = StreamHelper.getStream(videoRef);
      
      if (videoStream) {
        const [ videoTrack ] = videoStream.getVideoTracks();
        const [ audioTrack ] = videoStream.getAudioTracks();
        return {
          videoSource: videoTrack,
          audioSource: audioTrack? audioTrack: false
        }
      } else {
        return {
          videoSource: undefined,
          audioSource: undefined
        }
      }
    },
    [videoRef]
  )

  React.useEffect(
    () => {
      async function doPublish() {
        const { videoSource, audioSource } = await preparePublish();
        const user = new User({ name: "vod", role: "vod" });

        publish({
          user,
          session,
          extraData: {
            fitMode: "contain",
            videoSource,
            audioSource,
            insertDefaultUI: false
          }
        })
      }

      if (!lodash.isEmpty(videoSource) && videoRef) doPublish();
    },
    [videoSource, videoRef, preparePublish, publish, session]
  )

  React.useEffect(() => {
    if(inputRef) inputRef.value = "";
  });

  return (
    <>
      <input 
        ref={setInputRef}
        type="file"
        multiple={false} 
        onChange={handleFileChange}
        accept="video/mp4,video/x-m4v,video/*"
        className={mStyles.invisible}
      />
      <ControlButton
        { ...props }
        size={size}
        fontSize={fontSize}
        active={!lodash.isEmpty(videoSource)}
        onClick={handleClick}
      >
        <TheatersIcon fontSize="inherit" />
      </ControlButton>
    </>
  )
}
export default VODButton;