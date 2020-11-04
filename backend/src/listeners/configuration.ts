import ConfigurationAPI from "../api/configuration";
import { Request, Response } from "express";

class ConfigurationListener{
  static async retrieveByTenant(req: Request, res: Response): Promise<void>{
    const { tenant } = req.params;
    const configuration = await ConfigurationAPI.retrieve({ tenant });
    return res.json(configuration.toResponse()).end();
  }  
}
export default ConfigurationListener;