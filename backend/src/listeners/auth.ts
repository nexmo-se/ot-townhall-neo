import lodash from "lodash";
import ConfigurationAPI from "../api/configuration";
import { Request, Response } from "express";
import type { TRole } from "../entities/configuration";


class AuthListener {
  static async authenticate(req: Request, res: Response){
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
        const pin = configuration.retrievePin(roleString as TRole);
        if (inputPin === pin) return res.status(200).end();
      }
    }
    return res.status(403).end();
  }
}
export default AuthListener;