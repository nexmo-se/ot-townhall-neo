import DatabaseAPI from "../api/database";
import Participant from "../entities/participant";
import { v4 as uuid } from "uuid";
import { PoolClient } from "pg";

interface BaseOptions {
  tenant: string
}

interface CreateOptions extends BaseOptions {
  participant: Participant;
}

interface ListParticipantOptions extends BaseOptions {};
interface DeleteParticipantOptions extends BaseOptions {};

class AMAAPI{
  static async createParticipant({ tenant, participant }: CreateOptions): Promise<void>{
    await DatabaseAPI.query(async (client: PoolClient) => {
      const query = "INSERT INTO participants(id, first_name, last_name, email, company_name, tenant, created_at, is_deleted) VALUES ($1, $2, $3, $4, $5, $6, NOW(), 0)";
      const params = [ uuid(), participant.firstName, participant.lastName, participant.email, participant.companyName, tenant ];
      await client.query(query, params);
    });
  }

  static async listParticipant ({ tenant } : ListParticipantOptions) {
    const participants = await DatabaseAPI.query<Participant[]>(
      async (client: PoolClient) => {
        const query = "SELECT * FROM participants WHERE tenant = $1 AND is_deleted = 0";
        const params = [tenant];
        const response = await client.query(query, params);

        // convert response to participants
        const participants = response.rows.map(
          (row) => {
            return new Participant({
              firstName: row.first_name,
              lastName: row.last_name,
              email: row.email,
              companyName: row.company_name
            })
          }
        )
        return participants;
      }
    );
    return participants;
  }

  static async deleteParticipants ({ tenant }: DeleteParticipantOptions) {
    await DatabaseAPI.query(
      async (client: PoolClient) => {
        const query = "UPDATE participants SET is_deleted = 1 WHERE tenant = $1";
        const params = [tenant];
        await client.query(query, params);
      }
    )
  }
}
export default AMAAPI;