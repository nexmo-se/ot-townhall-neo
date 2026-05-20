import InMemoryStore from "../api/database";
import Participant from "../entities/participant";
import { v4 as uuid } from "uuid";

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
    const id = uuid();
    InMemoryStore.participants.set(id, {
      id,
      tenant,
      first_name: participant.firstName,
      last_name: participant.lastName,
      email: participant.email,
      company_name: participant.companyName,
      created_at: new Date(),
      is_deleted: 0
    });
  }

  static async listParticipant ({ tenant } : ListParticipantOptions) {
    const participants: Participant[] = [];
    for (const p of InMemoryStore.participants.values()) {
      if (p.tenant === tenant && p.is_deleted === 0) {
        participants.push(new Participant({
          firstName: p.first_name,
          lastName: p.last_name,
          email: p.email,
          companyName: p.company_name
        }));
      }
    }
    return participants;
  }

  static async deleteParticipants ({ tenant }: DeleteParticipantOptions) {
    for (const [id, p] of InMemoryStore.participants) {
      if (p.tenant === tenant) {
        p.is_deleted = 1;
        InMemoryStore.participants.set(id, p);
      }
    }
  }
}
export default AMAAPI;