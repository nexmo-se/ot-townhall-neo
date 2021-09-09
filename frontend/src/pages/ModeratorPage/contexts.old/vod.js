import React from "react";

export const VODContext = React.createContext({
  setVideoSource: (videoSource) => {},
  setVideoRef: (videoRef) => {},
  clearVideoSource: () => {},
  videoSource: "",
  videoRef: undefined
})

export default function VODProvider({ children }) {
  const [videoSource, setVideoSource ] = React.useState("");
  const [videoRef, setVideoRef] = React.useState();

  function clearVideoSource() {
    setVideoSource("");
  }

  return (
    <VODContext.Provider
      value={{
        setVideoSource,
        setVideoRef,
        clearVideoSource,
        videoSource,
        videoRef
      }}
    >
      {children}
    </VODContext.Provider>
  )
}