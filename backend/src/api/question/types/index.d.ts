import { Status } from "../../../entities/question/types";

export type MarkAsOptions = {
  questionID: string;
  sessionID: string;
  status: Status
}

export type ListOptions = {
  sessionID: string;
}