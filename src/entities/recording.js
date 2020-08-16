// @flow
class Recording{
  id: string;
  sessionID: string;
  
  constructor(args:any){
    this.id = args.id;
    this.sessionID = args?.sessionID;
  }
  
  static fromResponse(data:any):Recording{
    const recording = new Recording({
      id: data.id,
      sessionID: data.session_id
    })
    return recording;
  }
}
export default Recording;