// @flow
import { Stream, Connection, Subscriber } from "@opentok/client";

export type Role = "presenter" | "moderator" | "participant" | "unknown" | "system" | "vod" | "sharescreen" | "ghostrider";
interface IUser {
  name: string;
  id?: string | void;
  stream?: Stream;
  connection?: Connection;
  subscriber?: Subscriber;
  role: Role
}

class User implements IUser{
  static system: User;

  name: string;
  id: string | void;
  stream: Stream | void;
  connection: Connection | void;
  subscriber: Subscriber | void;
  role: Role;

  constructor(args: IUser){
    this.name = args.name;
    this.role = args.role;
    this.id = args.id ?? undefined;
    this.stream = args.stream;
  }

  toJSON(){
    const jsonData = {
      id: this.id,
      name: this.name,
      role: this.role
    }
    return JSON.parse(JSON.stringify(jsonData));
  }

  static get systemUser(){
    if(!User.system) User.system = new User({ name: "System", role: "system" });
    return User.system;
  }

  static fromJSON(data:any):User{
    const user = new User({ name: data.name, role: data.role, id: data.id });
    return user;
  }

  static fromConnection(connection: Connection): User{
    const data = JSON.parse(connection.data);
    const user = User.fromJSON(data);
    user.id = connection.id;
    return user;
  }
}
export default User;