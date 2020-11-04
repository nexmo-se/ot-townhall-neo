import PollAPI from "../api/poll";
import PollItem from "../entities/poll-item";
import Poll from "../entities/poll";

class PollListener{
  static async create(req: any, res: any){
    const { 
      session_id: sessionID, 
      title, 
      items 
    } = req.body;

    const pollItems = items.map((item: any) => PollItem.fromRequest(item));
    const poll = new Poll({ 
      title, 
      sessionID,
      items: pollItems 
    });

    await PollAPI.create(poll);
    return res.json({}).end();
  }

  static async poll(req: any, res: any){
    const { poll_id: pollID } = req.params;
    const { 
      item_id: itemID, 
      user 
    } = req.body;

    await PollAPI.poll({
      pollID,
      itemID,
      userID: user.id,
      name: user.name
    });
    return res.json({}).end();
  }

  static async list(req: any, res: any){
    const { session_id: sessionID } = req.query;
    const polls = await PollAPI.list({ sessionID });
    const payload = polls.map((poll) => poll.toResponse());
    return res.json(payload).end();
  }

  static async retrievePoll(req: any, res: any){
    const { polling_id: pollingID } = req.params;
    const { user_id: userID } = req.query;
    const pollItem = await PollAPI.retrievePoll({ pollingID, userID });
    return res.json(pollItem.toResponse()).end();
  }

  static async update(req: any, res: any){
    const { polling_id } = req.params;
    const { status } = req.query;
    await PollAPI.update({ pollingID: polling_id, status });
    return res.json({}).end();
  }
}
export default PollListener;