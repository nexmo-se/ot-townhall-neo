// @flow
import React from "react";
import StreamHelper from "utils/stream-helper";
import User from "entities/user";

import useStyles from "./styles";
import usePublisher from "hooks/publisher";

import TheatersIcon from '@material-ui/icons/Theaters';
import ControlButton from "components/ControlButton";

type VODButtonProps = {
  size?: number,
  fontSize?: number,
  style?: any
}

function VODButton({ size, fontSize, ...props }: VODButtonProps){
  const [ isPublishing, setIsPublishing ] = React.useState<boolean>(false);
  const [ inputRef, setInputRef ] = React.useState<any>();
  const [ videoRef, setVideoRef ] = React.useState<any>();
  const [ videoSource, setVideoSource ] = React.useState<string | void>();
  const mStyles = useStyles();
  const mPublisher = usePublisher("cameraContainer");

  function handleClick(){
    if(!isPublishing){
      if(inputRef) inputRef.click();
    }else setVideoSource(undefined);
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
      if(videoStream){
        const [ videoTrack ] = videoStream.getVideoTracks();
        const [ audioTrack ] = videoStream.getAudioTracks();

        const user = new User("vod", "vod");
        await mPublisher.publish(user, {
          fitMode: "contain",
          videoSource: videoTrack,
          audioSource: audioTrack? audioTrack: false
        });
        setIsPublishing(true);
      }
    }

    async function unpublish(){
      await mPublisher.unpublish();
      setIsPublishing(false);
    }

    if(videoRef) publish();
    else if(!videoRef && mPublisher.publisher) unpublish();
  }, [ videoRef, mPublisher ]);

  React.useEffect(() => {
    if(inputRef) inputRef.value = "";
  }, [ inputRef, videoSource ]);

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
      {!!videoSource && (
        <video 
          ref={setVideoRef}
          className={mStyles.invisible}
          src={videoSource}
        />
      )}
      <ControlButton
        { ...props }
        size={size}
        fontSize={fontSize}
        active={isPublishing}
        onClick={handleClick}
      >
        <TheatersIcon fontSize="inherit" />
      </ControlButton>
    </>
  )
}
export default VODButton;