import ConfigurationAPI from "../api/configuration";
import { Request, Response } from "express";

class ConfigurationListener {
  static async retrieveByTenant (req: Request, res: Response): Promise<void> {
    const { tenant } = req.params;
    // add default before retrieveing configuration
    // this will ensure that we have default configuration
    await ConfigurationAPI.createDefault({ tenant });

    const configuration = await ConfigurationAPI.retrieve({ tenant });
    if (configuration) return res.json(configuration.toResponse()).end();
    else return res.status(404).end();
  }  

  static async updateByTenant (req: Request, res: Response): Promise<void> {
    const { tenant } = req.params;
    const { data } = req.body;
    await ConfigurationAPI.update(tenant, data);
    return res.json({}).end();
  }
}

export default ConfigurationListener;
