// @flow
import { detect } from "detect-browser";

class StreamHelper{
  static getStream(videoElement:any): MediaStream | void{
    const browser = detect();
    switch(browser && browser.name){
      case "firefox":
        if(videoElement.mozCaptureStream) return videoElement.mozCaptureStream();
        else return videoElement.captureStream();
      case "chrome":
        return videoElement.captureStream();
      default: return undefined
    }
  }
}
export default StreamHelper;