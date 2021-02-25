// @flow
import React from "react";
import StreamHelper from "utils/stream-helper";
import User from "entities/user";
import lodash from "lodash";

import useVOD from "../../hooks/vod";
import useStyles from "./styles";
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
  const [isPublishing, setIsPublishing] = React.useState<boolean>(false);
  const [inputRef, setInputRef]  = React.useState<any>();
  const { me } = useMe();
  const { session } = useSession();
  
  const {
    publish: doPublish,
    unpublish: doUnpublish
  } = usePublisher({ containerID: "cameraContainer", name: `${me?.name ?? ""}'s Video` });

  const {
    videoSource,
    setVideoSource,
    videoRef
  } = useVOD();

  const mStyles = useStyles();

  function handleClick(){
    if (lodash.isEmpty(videoSource)){
      if(inputRef) inputRef.click();
    }else setVideoSource("");
  }

  function handleFileChange(e){
    const [ selectedVideo ] = e.target.files;
    const videoURL = URL.createObjectURL(selectedVideo);
    setVideoSource(videoURL);
  }

  React.useEffect(() => {
    async function publish(){
      await videoRef.play();

      const videoStream = StreamHelper.getStream(videoRef);
      if (videoStream) {
        alert("Your video might not shown in some browser");

        setIsPublishing(true);
        const [videoTrack] = videoStream.getVideoTracks();
        const [audioTrack] = videoStream.getAudioTracks();

        const user = new User({ name: "vod", role: "vod" });
        doPublish({
          user,
          session,
          extraData: {
            fitMode: "contain",
            videoSource: videoTrack,
            audioSource: audioTrack? audioTrack: false,
            bitrate: 64000,
            insertDefaultUI: false
          }
        })
      }
    }

    async function unpublish(){
      setIsPublishing(false);
      doUnpublish({ session })
    }

    if(videoSource && !isPublishing && session) publish();
    else if(!videoSource && isPublishing && session) unpublish();
  }, [ videoSource, videoRef, isPublishing, doPublish, doUnpublish, session ]);

  React.useEffect(() => {
    if(inputRef) inputRef.value = "";
  }, [inputRef, videoSource]);

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