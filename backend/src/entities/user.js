// @flow
import moment from "moment";

class User{
  id: string;
  name: string;
  role: string;
  token: string;
  
  constructor(args:any){
    this.id = args.id;
    this.name = args.name;
    this.role = args.role;
    this.token = args.token;
  }
  
  toDatabase(){
    const jsonData = {
      id: this.id,
      name: this.name,
      role: this.role
    }
    return JSON.parse(JSON.stringify(jsonData));
  }
  
  static fromDatabase(data:any):User{
    const user = new User({
      id: data.id,
      name: data.name,
      role: data.role
    });
    return user;
  }
}
export default User;