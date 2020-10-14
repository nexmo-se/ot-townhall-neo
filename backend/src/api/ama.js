// @flow
import DatabaseAPI from "api/database";
import Participant from "entities/participant";
import { v4 as uuid } from "uuid";

class AMAAPI{
  static async createParticipant(participant: Participant): Promise<any>{
    return DatabaseAPI.query(async (client: any) => {
      const query = "INSERT INTO participants(id, first_name, last_name, email, company_name, created_at) VALUES ($1, $2, $3, $4, $5, NOW())";
      const params = [ uuid(), participant.firstName, participant.lastName, participant.email, participant.companyName ];
      return client.query(query, params);
    })
  }
}
export default AMAAPI;