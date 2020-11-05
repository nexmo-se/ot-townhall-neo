import DatabaseAPI from "../api/database";
import Participant from "../entities/participant";
import { v4 as uuid } from "uuid";
import { PoolClient } from "pg";

interface ICreate {
  tenant: string;
  participant: Participant;
}

class AMAAPI{
  static async createParticipant({ tenant, participant }: ICreate): Promise<void>{
    await DatabaseAPI.query(async (client: PoolClient) => {
      const query = "INSERT INTO participants(id, first_name, last_name, email, company_name, tenant, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())";
      const params = [ uuid(), participant.firstName, participant.lastName, participant.email, participant.companyName, tenant ];
      await client.query(query, params);
    });
  }
}
export default AMAAPI;