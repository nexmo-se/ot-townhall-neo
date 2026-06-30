import DatabaseAPI from "../api/database";
import { PoolClient } from "pg";
import { v4 as uuid } from "uuid";

import Poll from "../entities/poll";
import CustomError from "../entities/error";
import PollItem from "../entities/poll-item";
import type { Status } from "../entities/poll";

interface IList { sessionID: string; }
interface IRetrievePoll {
  userID: string;
  pollingID: string;
}

interface IPoll {
  pollID: string;
  itemID: string;
  userID: string;
  name: string;
}

interface IUpdate {
  pollingID: string;
  status: Status;
}

class PollAPI{
  static async create(poll: Poll): Promise<void>{
    await DatabaseAPI.query(async (client: PoolClient) => {
      const pollingID = uuid();
      await client.query("UPDATE pollings SET status=$1 WHERE session_id=$2", [ "finished", poll.sessionID ]);
      await client.query(
        "INSERT INTO pollings(id, session_id, title, status, created_at) VALUES($1, $2, $3, $4, NOW())",
        [ pollingID, poll.sessionID, poll.title, poll.status ]
      );

      const promises = poll.items.map(async (item) => {
        await client.query(
          "INSERT INTO poll_items(id, polling_id, option, count, order_number, updated_at, created_at) VALUES($1, $2, $3, $4, $5, NOW(), NOW())",
          [ uuid(), pollingID, item.option, item.count, item.orderNumber ]
        );
      });
      await Promise.all(promises);
    });
  }

  static async list({ sessionID }: IList): Promise<Poll[]>{
    return await DatabaseAPI.query(async (client: PoolClient) => {
      const queryResponse = await client.query(
        "SELECT * FROM pollings WHERE session_id=$1 AND status != $2 AND status != $3",
        [ sessionID, "finished", "deleted" ]
      );
      if(queryResponse.rowCount === 0) throw new CustomError("NotFound", "Cannot find pollings");
      
      const polls = queryResponse.rows.map((response) => Poll.fromDatabase(response));
      const promises = polls.map(async (poll) => {
        const queryResponse = await client.query("SELECT * FROM poll_items WHERE polling_id=$1", [ poll.id ]);
        const pollItems = queryResponse.rows.map((response) => PollItem.fromDatabase(response));
        return new Poll({ ...poll, items: pollItems });
      });
      const finalPolls = await Promise.all(promises);
      return finalPolls;
    });
  }

  static async poll({ pollID, itemID, userID, name }: IPoll): Promise<void>{
    await DatabaseAPI.query(async (client: PoolClient) => {
      await client.query(
        "INSERT INTO polls(id, polling_id, item_id, user_id , name, created_at) VALUES($1, $2, $3, $4, $5, NOW())",
        [ uuid(), pollID, itemID, userID, name ]
      );
      await client.query("UPDATE poll_items SET count = count + 1 WHERE polling_id=$1 AND id=$2", [ pollID, itemID ]);
    });
  }

  static async retrievePoll({ pollingID, userID }: IRetrievePoll): Promise<PollItem>{
    return await DatabaseAPI.query(async (client: PoolClient) => {
      const queryResponse = await client.query(
        "SELECT * FROM polls WHERE polling_id=$1 AND user_id=$2 ORDER BY created_at", 
        [ pollingID, userID ]
      );
      const [ item ] = queryResponse.rows.map((response) => response.item_id);

      const itemResponse = await client.query("SELECT * FROM poll_items WHERE id=$1", [ item ]);
      const [ poll ] = itemResponse.rows.map((response) => PollItem.fromDatabase(response));
      return poll;
    });
  }

  static async update({ pollingID, status }: IUpdate): Promise<void>{
    await DatabaseAPI.query(async (client: any) => {
      await client.query("UPDATE pollings SET status=$1 WHERE id=$2", [ status, pollingID ]);
    });
  }
}
export default PollAPI;