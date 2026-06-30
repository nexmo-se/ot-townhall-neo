import lodash from "lodash";
import ConfigurationAPI from "../api/configuration";
import { Request, Response } from "express";
import type { AcceptedRole } from "../entities/configuration";


class AuthListener {
  static async authenticate(req: Request, res: Response): Promise<void>{
    const { 
      pin: inputPin,
      tenant, 
      role
    } = req.body;
    
    if (lodash.isString(tenant) && lodash.isString(role)){
      const tenantString = lodash.toString(tenant);
      const roleString = lodash.toString(role);
      const acceptedRoles = [ "participant", "moderator", "presenter" ];
      if(acceptedRoles.includes(roleString)){
        const configuration = await ConfigurationAPI.retrieve({ tenant: tenantString });
        if (configuration){
          const pin = configuration.retrievePin(roleString as AcceptedRole);
          if (inputPin === pin) return res.json({}).end();
        }
      }
    }
    return res.status(403).end();
  }
}
export default AuthListener;