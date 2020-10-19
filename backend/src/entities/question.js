// @flow
import User from "entities/user";
import moment from "moment";
import { v4 as uuid } from "uuid";

export type TStatus = "answered" | "open" | "selected";
interface QuestionProps{
  id?: string;
  owner: User;
  content: string;
  voters?: Array<User>;
  vote?: number;
  status?: TStatus
}

class Question implements QuestionProps{
  id: string;
  owner: User;
  content: string;
  voters: Array<User>;
  vote: number;
  status: TStatus;
  
  constructor(args: QuestionProps){
    this.owner = args.owner;
    this.content = args.content;
    this.voters = args?.voters || [];
    this.vote = args?.vote || 0;
    this.id = args?.id ?? uuid();
    this.status = args?.status ?? "open"
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
      status: this.status,
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