// @flow
import User from "entities/user";

class Question{
  id: string;
  owner: User;
  content: string;
  vote: number;
  voters: Array<User>;
  
  constructor(args:any){
    this.owner = args.owner;
    this.content = args.content;
    this.id = args?.id;
    this.vote = args?.vote ?? 0;
    this.voters = args?.voters ?? [];
  }
  
  toRequest(){
    const jsonData = {
      owner: {
        id: this.owner.id,
        name: this.owner.name,
        role: this.owner.role
      },
      content: this.content
    }
    return JSON.parse(JSON.stringify(jsonData));
  }
}
export default Question;