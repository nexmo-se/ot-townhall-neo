// @flow
import moment from "moment";
import User from "entities/user";

interface QuestionProps{
  id?: string,
  owner: User,
  content: string,
  voters?: Array<User>,
  vote?: number
}

class Question implements QuestionProps{
  id: string;
  owner: User;
  content: string;
  voters: Array<User>;
  vote: number;
  
  constructor(args:any){
    this.owner = args.owner;
    this.content = args.content;
    this.voters = args?.voters || [];
    this.vote = args?.vote || 0;
    this.id = args?.id;
  }
  
  toDatabase(){
    const jsonData = {
      owner: {
        id: this.owner.id,
        name: this.owner.name,
        role: this.owner.role
      },
      content: this.content,
      created_at: new moment().unix(),
      vote: 0
    }
    return JSON.parse(JSON.stringify(jsonData))
  }
  
  static fromDatabase(data:any):Question{
    const question = new Question({
      owner: User.fromDatabase(data.owner),
      content: data.content,
      voters: data.voters || [],
      vote: data.vote
    });
    return question;
  }
}
export default Question;