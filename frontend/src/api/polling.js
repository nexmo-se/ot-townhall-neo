import PollingItem from "entities/polling-item";
import Polling from "entities/polling";
import User from "entities/user";
import { v4 as uuid } from "uuid";

export interface ICreate {
  title: string;
  items: PollingItem[];
}

export interface IRetrieveSelected {
  id: string;
  user: User;
}

export interface IPoll {
  id: string;
  itemID: string;
  user: User;
}

class PollingAPI{
  static create(args: ICreate){
    
  }

  static retrieve({ sessionID }: { sessionID: string }){
    return new Polling({
      title: "This is Polling",
      items: [
        new PollingItem({ id: uuid(), option: "Bad", count: 10 }),
        new PollingItem({ id: uuid(), option: "Good", count: 23 }),
        new PollingItem({ id: uuid(), option: "Better", count: 4 }),
        new PollingItem({ id: uuid(), option: "Best", count: 18 }),
      ],
      status: "started"
    })
  }

  static async start({ sessionID }: { sessionID: string }){

  }

  static async stop({ sessionID }: { sessionID: string }){
    
  }
  
  static async poll({ id, itemID, user }: IPoll){
    
  }

  static async retireveSelected({ id, user }: IRetrieveSelected): Promise<PollingItem>{
    
  }
}
export default PollingAPI;