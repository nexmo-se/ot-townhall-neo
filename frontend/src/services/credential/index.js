import Credential from "entities/credential";
import config from "config";
import lodash from "lodash";

export default class CredentialService {
  static async generateCredential (options) {
    const role = lodash(options).get("role", "publisher");
    const data = lodash(options).get("data", {});
    const tenant = lodash(options).get("tenant");

    const response = await fetch(`${config.apiURL}/rooms/${tenant}/info`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, data })
    })

    if (response.ok) {
      const jsonResponse = await response.json();
      const credential = new Credential(jsonResponse.apiKey, jsonResponse.sessionId, jsonResponse.token);
      return credential;  
    } else throw new Error(response.statusText);
  }
}