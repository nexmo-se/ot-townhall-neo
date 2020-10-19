// @flow
import PollAPI from "api/poll";
import PollItem from "entities/poll-item";
import Poll from "entities/poll";

class PollListener{
  static async create(req: any, res: any){
    const { session_id, title, items } = req.body;
    const pollItems = items.map((item) => PollItem.fromRequest(item));
    const poll = new Poll({ 
      title, 
      sessionID: session_id,
      items: pollItems 
    });
    await PollAPI.create(poll);
    return res.json({}).end();
  }

  static async poll(req: any, res: any){
    const { poll_id } = req.params;
    const { item_id, user } = req.body;
    await PollAPI.poll({
      pollID: poll_id,
      itemID: item_id,
      userID: user.id,
      name: user.name
    });
    return res.json({}).end();
  }

  static async list(req: any, res: any){
    const { session_id } = req.query;
    const polls = await PollAPI.list({ sessionID: session_id });
    const payload = polls.map((poll) => poll.toResponse());
    return res.json(payload).end();
  }

  static async retrievePoll(req: any, res: any){
    const { polling_id } = req.params;
    const { user_id } = req.query;
    const pollItem = await PollAPI.retrievePoll({ pollingID: polling_id, userID: user_id });
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