// @flow
class Recording{
  id: string;
  sessionID: string;
  status: string;
  
  constructor(args:any){
    this.id = args.id;
    this.sessionID = args?.sessionID;
    this.status = args?.status;
  }
  
  toResponse(){
    const jsonData = {
      id: this.id, 
      session_id: this.sessionID,
      status: this.status
    };
    return JSON.parse(JSON.stringify(jsonData));
  }
}
export default Recording;