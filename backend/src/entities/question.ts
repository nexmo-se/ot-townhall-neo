import User from "./user";
import moment from "moment";
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
  createdAt: number;
  
  constructor(args: IQuestion){
    this.owner = args.owner;
    this.content = args.content;
    this.voters = args.voters || [];
    this.vote = args.vote || 0;
    this.id = args.id ?? uuid();
    this.status = args.status ?? "open";
    this.createdAt = moment().unix();
  }
  
  toDatabase(): Record<string, any>{
    return {
      id: this.id,
      owner: {
        id: this.owner.id,
        name: this.owner.name,
        role: this.owner.role
      },
      content: this.content,
      created_at: this.createdAt,
      status: this.status,
      vote: this.vote,
      voters: this.voters.map((v) => v.toDatabase())
    };
  }

  toResponse(): Record<string, any> {
    return {
      id: this.id,
      owner: {
        id: this.owner.id,
        name: this.owner.name,
        role: this.owner.role
      },
      content: this.content,
      created_at: this.createdAt,
      status: this.status,
      vote: this.vote,
      voters: this.voters.map((v) => v.toDatabase())
    };
  }
  
  static fromDatabase(data: Record<string, any>): Question{
    const question = new Question({
      id: data.id,
      owner: User.fromDatabase(data.owner),
      content: data.content,
      voters: data.voters?.map((voter: any) => User.fromDatabase(voter)) || [],
      vote: data.vote,
      status: data.status ?? "deleted"
    });
    question.createdAt = data.created_at;
    return question;
  }
}
export default Question;