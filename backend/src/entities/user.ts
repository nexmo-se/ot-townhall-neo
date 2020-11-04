import type { Role } from "opentok";

interface IUser {
  id?: string;
  name?: string;
  role: Role;
  token?: string;
}

class User implements IUser{
  id: string;
  name: string;
  role: Role;
  token?: string;
  
  constructor(args: IUser){
    this.id = args.id;
    this.name = args.name;
    this.role = args.role;
    this.token = args.token;
  }
  
  toDatabase(): Record<string, string>{
    const jsonData = {
      id: this.id,
      name: this.name,
      role: this.role
    };
    return JSON.parse(JSON.stringify(jsonData));
  }
  
  static fromDatabase(data: Record<string, string>):User{
    const user = new User({
      id: data.id,
      name: data.name,
      role: data.role as Role
    });
    return user;
  }
}
export default User;