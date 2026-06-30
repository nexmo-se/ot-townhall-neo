// @flow
import User from "entities/user";
import { v4 as uuid } from "uuid";

export type TStatus = "answered" | "open" | "selected";
interface IQuestion {
  id?: string;
  owner: User;
  content: string;
  vote?: number;
  voters?: User[];
  status?: TStatus;
}

class Question implements IQuestion{
  id: string;
  owner: User;
  content: string;
  vote: number;
  voters: Array<User>;
  status: TStatus;
  
  constructor(args: IQuestion){
    this.owner = args.owner;
    this.content = args.content;
    this.id = args?.id ?? uuid();
    this.vote = args?.vote ?? 0;
    this.voters = args?.voters ?? [];
    this.status = args?.status ?? "open";
  }
  
  toRequest(){
    const jsonData = {
      owner: {
        id: this.owner.id,
        name: this.owner.name,
        role: this.owner.role
      },
      content: this.content,
      status: this.status
    }
    return JSON.parse(JSON.stringify(jsonData));
  }
}
export default Question;