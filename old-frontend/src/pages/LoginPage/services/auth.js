// @flow
import FetchService from "services/fetch";
import config from "config";
import type { Role } from "entities/user";

interface ILogin {
  role: Role;
  tenant: string;
  pin: string;
}

class AuthService{
  static async login({ role, tenant, pin }: ILogin){
    const url = `${config.apiURL}/auth`;
    await FetchService.post(
      url, 
      JSON.stringify({
        role,
        tenant,
        pin
      })
    )
  }
}
export default AuthService;