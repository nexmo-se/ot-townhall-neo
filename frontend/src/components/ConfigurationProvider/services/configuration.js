import ConfigurationConfig from "../configs";
import Configuration from "../models/configuration";
import axios from "axios";

export class ConfigurationService {
  static async retrieve ({ tenant }) {
    const url = `${ConfigurationConfig.apiUrl}/configurations/${tenant}`
    const response = await axios.get(url);
    return Configuration.fromResponse(response.data);
  }

  static async update ({ tenant, data }) {
    const url = `${ConfigurationConfig.apiUrl}/configurations/${tenant}`;
    const headers = { "Content-Type": "application/json" }
    await axios.put(url, { data }, { headers });
  }
}
