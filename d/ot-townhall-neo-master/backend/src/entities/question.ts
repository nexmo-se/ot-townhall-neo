import User from "./user";
import moment from "moment";
import admin from "firebase-admin";
import { v4 as uuid } from "uuid";

export type TStatus = "answered" | "open" | "selected" | "deleted";
interface IQuestion{
  id?: string;
  owner: User;
  content: string;
  voters?: Array<User>;
  vote?: number;
  status?: TStatus
}

class Question implements IQuestion{
  id: string;
  owner: User;
  content: string;
  voters: User[];
  vote: number;
  status: TStatus;
  
  constructor(args: IQuestion){
    this.owner = args.owner;
    this.content = args.content;
    this.voters = args.voters || [];
    this.vote = args.vote || 0;
    this.id = args.id ?? uuid();
    this.status = args.status ?? "open";
  }
  
  toDatabase(): Record<string, string | Record<string, string>>{
    const jsonData = {
      owner: {
        id: this.owner.id,
        name: this.owner.name,
        role: this.owner.role
      },
      content: this.content,
      created_at: moment().unix(),
      status: this.status,
      vote: 0
    };
    return JSON.parse(JSON.stringify(jsonData));
  }
  
  static fromDatabase(data: admin.firestore.DocumentData): Question{
    const values = data.data();
    const question = new Question({
      id: data.ref.id,
      owner: User.fromDatabase(values.owner),
      content: values.content,
      voters: values.voters?.map((voter: any) => User.fromDatabase(voter)) || [],
      vote: values.vote,
      status: values.status ?? "deleted"
    });
    return question;
  }
}
export default Question;