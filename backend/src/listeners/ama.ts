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
}
export default AMAListener;