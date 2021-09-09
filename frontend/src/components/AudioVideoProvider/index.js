import MediaControl from "./components/MediaControl";
import { AudioVideoContext } from "./contexts/audio-video";
import { useState } from "react";

function AudioVideoProvider ({ children }) {
  const [hasAudio, setHasAudio] = useState(true);
  const [hasVideo, setHasVideo] = useState(true);

  return (
    <AudioVideoContext.Provider
      value={{
        hasVideo,
        hasAudio,
        setHasVideo,
        setHasAudio
      }}
    >
      {children}
    </AudioVideoContext.Provider>
  )
}

export { MediaControl };
export { useAudioVideo } from "./hooks/audio-video";
export default AudioVideoProvider;
