import User from "../user";
import admin from "firebase-admin";
import lodash from "lodash";
import { Status } from "./types";
import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";

interface Constructor {
  id?: string;
  owner: User;
  content: string;
  voters?: User[];
  vote?: number;
  status?: Status;
}

class Question {
  id: string;
  owner: User;
  content: string;
  voters: User[];
  vote: number;
  status: Status;
  
  constructor (args: Constructor) {
    this.owner = args.owner;
    this.content = args.content;
    this.voters = args.voters ?? [];
    this.vote = args.vote ?? 0;
    this.id = args.id ?? uuid();
    this.status = args.status ?? "open";
  }
  
  toDatabase () {
    const jsonData = {
      owner: {
        id: this.owner.id,
        name: this.owner.name,
        role: this.owner.role
      },
      content: this.content,
      created_at: DateTime.utc().toSeconds(),
      status: this.status,
      vote: 0
    };

    return lodash(jsonData).omitBy(lodash.isNil).value()
  }
  
  static fromDatabase (data: admin.firestore.DocumentData): Question {
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