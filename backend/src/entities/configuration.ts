import lodash from "lodash";

interface IRole {
  loginType: "default" | "ama" | "sso";
  pin: string;
}

interface ITabs {
  questions: boolean;
  participants: boolean;
  polling: boolean;
  chat: boolean;
}

interface IConfiguration {
  tabs: ITabs;
  participant: IRole;
  presenter: IRole;
  moderator: IRole;
}

class Configuration implements IConfiguration{
  tabs: ITabs;
  participant: IRole;
  presenter: IRole;
  moderator: IRole;

  constructor(args: IConfiguration){
    Object.assign(this, args);
  }

  toResponse(){
    const roleModel = { loginType: true }
    const jsonData = {
      participant: lodash.pick(this.participant, lodash.keys(roleModel)),
      presenter: lodash.pick(this.presenter, lodash.keys(roleModel)),
      moderator: lodash.pick(this.moderator, lodash.keys(roleModel)),
      tabs: this.tabs
    }
    return JSON.parse(JSON.stringify(jsonData));
  }

  static fromDatabase(args: any){
    return new Configuration(args as IConfiguration);
  }
}
export default Configuration;