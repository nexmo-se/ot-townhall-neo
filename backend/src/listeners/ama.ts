import Participant from "../entities/participant";
import AMAAPI from "../api/ama";

class AMAListener{
  static async createParticipant(req: any, res:any){
    const { 
      first_name: firstName, 
      last_name: lastName, 
      email, 
      company_name: companyName
    } = req.body;

    const participant = new Participant({
      firstName, lastName, email, companyName
    });
    await AMAAPI.createParticipant(participant);
    return res.status(200).end();
  }
}
export default AMAListener;