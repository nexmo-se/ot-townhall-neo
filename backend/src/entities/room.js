// @flow
class Room{
  id: string;
  name: string;
  sessionID: string;

  constructor(args: any){
    this.id = args.id;
    this.name = args.name;
    this.sessionID = args.sessionID;
  }

  static fromDatabase(row:any):Room{
    const room = new Room({
      id: row.id,
      name: row.name,
      sessionID: row.session_id
    });
    return room;
  }
}
module.exports = Room;