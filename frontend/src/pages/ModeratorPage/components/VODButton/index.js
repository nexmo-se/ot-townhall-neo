// @flow
import React from "react";
import FetchHelper from "helper/fetch";
import StreamHelper from "utils/stream-helper";
import User from "entities/user";

import useStyles from "./styles";
import usePublisher from "hooks/publisher";
import useSession from "hooks/session";
import useMe from "hooks/me";

import TheatersIcon from '@material-ui/icons/Theaters';
import ControlButton from "components/ControlButton";

interface IVODButton {
  size?: number,
  fontSize?: number,
  style?: any
}

function VODButton({ size, fontSize, ...props }: IVODButton){
  const [ isPublishing, setIsPublishing ] = React.useState<boolean>(false);
  const [ inputRef, setInputRef ] = React.useState<any>();
  const [ videoSource, setVideoSource ] = React.useState<string | void>();
  const mStyles = useStyles();
  const mMe = useMe();
  const mPublisher = usePublisher({ containerID: "cameraContainer", name: `${mMe.me?.name ?? ""}'s Video` });
  const mSession = useSession();
  const videoRef = React.useRef();

  function handleClick(){
    if (!isPublishing){
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
      await videoRef.current?.play();

      const videoStream = StreamHelper.getStream(videoRef.current);
      if(videoStream){
        setIsPublishing(true);
        const [ videoTrack ] = videoStream.getVideoTracks();
        const [ audioTrack ] = videoStream.getAudioTracks();

        const user = new User({ name: "vod", role: "vod" });
        FetchHelper.fetch(mPublisher.publish, undefined, {
          user,
          session: mSession.session,
          extraData: {
            fitMode: "contain",
            videoSource: videoTrack,
            audioSource: audioTrack? audioTrack: false
          }
        })
      }
    }

    async function unpublish(){
      setIsPublishing(false);
      FetchHelper.fetch(mPublisher.unpublish, undefined, { session: mSession.session });
    }

    if(videoSource && !isPublishing && mSession.session) publish();
    else if(!videoSource && isPublishing && mSession.session) unpublish();
  }, [ videoSource, isPublishing, mPublisher.publish, mPublisher.unpublish, mSession.session ]);

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
      {(videoSource)? (
        <video 
          ref={videoRef}
          className={mStyles.invisible}
          src={videoSource}
        />
      ): null}
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