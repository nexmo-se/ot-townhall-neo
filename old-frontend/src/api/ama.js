// @flow
import config from "config";
import Participant from "entities/participant";

interface ICreate {
  tenant: string;
  participant: Participant;
}

class AMAAPI{
  static async create({ tenant, participant }: ICreate){
    const response = await fetch(`${config.apiURL}/ama/participants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenant,
        ...participant.toRequest()
      })
    });
    if(response.ok) return true;
    else throw new Error(response.statusText);
  }
}
export default AMAAPI;