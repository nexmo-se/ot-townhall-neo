// @flow
import React from "react";

interface IVODProvider {
  children: any;
}

interface IVODContext {
  setVideoSource: (videoSource: string) => void;
  setVideoRef: (videoRef: any) => void;
  clearVideoSource: () => void;
  videoSource: string;
  videoRef: any;
}

export const VODContext = React.createContext<IVODContext>({
  setVideoSource: (videoSource: string) => {},
  setVideoRef: (videoRef: any) => {},
  clearVideoSource: () => {},
  videoSource: "",
  videoRef: undefined
})

export default function VODProvider({ children }: IVODProvider) {
  const [videoSource, setVideoSource ] = React.useState<string>("");
  const [videoRef, setVideoRef] = React.useState<any>();

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