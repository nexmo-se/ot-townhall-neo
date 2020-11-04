interface IRoom{
  id?: string;
  name: string;
  sessionID?: string;
}

class Room{
  id: string;
  name: string;
  sessionID: string;

  constructor(args: IRoom){
    this.id = args.id;
    this.name = args.name;
    this.sessionID = args.sessionID;
  }

  static fromDatabase(row: Record<string, string>): Room{
    const room = new Room({
      id: row.id,
      name: row.name,
      sessionID: row.session_id
    });
    return room;
  }
}
export default Room;