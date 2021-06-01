import Participant from "../entities/participant";
import AMAAPI from "../api/ama";
import { Request, Response } from "express";

class AMAListener{
  static async createParticipant(req: Request, res: Response): Promise<void>{
    const { 
      tenant,
      first_name: firstName, 
      last_name: lastName, 
      email, 
      company_name: companyName
    } = req.body;

    const participant = new Participant({
      firstName, lastName, email, companyName
    });
    await AMAAPI.createParticipant({ tenant, participant });
    return res.status(200).end();
  }

  static async listParticipant (req: Request, res: Response) {
    const { tenant } = req.body;
    const participants = await AMAAPI.listParticipant({ tenant });

    // convert participant entity to JSON response
    const payload = participants.map(
      (participant) => ({
        first_name: participant.firstName,
        last_name: participant.lastName,
        email: participant.email,
        company_name: participant.companyName,
        tenant
      })
    );

    return res.json(payload).end();
  }

  static async resetParticipants (req: Request, res: Response) {
    const { tenant } = req.body;
    await AMAAPI.deleteParticipants({ tenant });
    return res.status(200).end();
  }
}
export default AMAListener;