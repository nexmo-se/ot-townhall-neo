// @flow
import config from "config";
import Recording from "entities/recording";
import { Session, Stream } from "@opentok/client";

class RecordingAPI{
  static async startRecording(session:Session):Promise<Recording>{
    const response = await fetch(`${config.apiURL}/recordings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: session.sessionId })
    });
    if(response.ok){
      const { id: recordingID } = await response.json();
      const recording = new Recording({ id: recordingID });
      return recording;
    }else throw new Error(response.statusText);
  }
  
  static async stopRecording(recording:Recording){
    const response = await fetch(`${config.apiURL}/recordings/${recording.id}`, {
      method: "DELETE"
    });
    if(response.ok) return;
    else throw new Error(response.statusText);
  }
  
  static retrieveLayoutType(streams:Array<Stream>):"presentation"|"bestFit"{
    const foundPresentation = streams.find((stream) => {
      if(stream.videoType === "screen") return true;
      else return false;
    });
    if(foundPresentation) return "presentation";
    else return "bestFit";
  }
  
  static retrievePresentationStreams(streams:Array<Stream>):Array<Stream>{
    const presentationStreams = streams.filter((stream) => {
      if(stream.videoType === "screen") return true;
      else return false;
    })
    return presentationStreams;
  }
  
  static async setLayout(recording:Recording, layout:string, streams?:Array<Stream>){
    const response = await fetch(`${config.apiURL}/recordings/${recording.id}/layout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: layout,
        streams: streams?.map((stream) => stream.id)
      })
    });
    if(response.ok) return;
    else throw new Error(response.statusText)
  }
  
  static async setPresentationLayout(recording:Recording, streams:Array<Stream>):Promise<void>{
    return RecordingAPI.setLayout(recording, "presentation", streams)
  }
  
  static async setBestFitLayout(recording:Recording):Promise<void>{
    return RecordingAPI.setLayout(recording, "bestFit");
  }
  
  static async retrieveActive(sessionID:string){
    const response = await fetch(`${config.apiURL}/recordings/active?session_id=${sessionID}`);
    if(response.ok){
      const jsonResponse = await response.json();
      return jsonResponse.map((response) => Recording.fromResponse(response));
    }else throw new Error(response.statusText);
  }
  
  static async retrieveStatus(recording:Recording){
    const response = await fetch(`${config.apiURL}/recordings/${recording.id}/status`);
    if(response.ok){
      const { status } = await response.json();
      return status;
    }else throw new Error(response.statusText);
  }
}
export default RecordingAPI;