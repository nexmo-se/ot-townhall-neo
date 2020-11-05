import lodash from "lodash";

export type TRole = "participant" | "moderator" | "presenter";
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

  retrievePin(role: TRole){
    if (role === "participant") return this.participant.pin;
    else if(role === "presenter") return this.presenter.pin;
    else if(role === "moderator") return this.moderator.pin;
    else throw new Error("Invalid role");
  }

  toResponse(){
    const roleModel = { loginType: true }
    const participant = lodash.pick(this.participant, lodash.keys(roleModel));
    const presenter = lodash.pick(this.presenter, lodash.keys(roleModel));
    const moderator = lodash.pick(this.moderator, lodash.keys(roleModel));

    const jsonData = {
      participant: lodash.mapKeys(participant, (_value, key) => lodash.snakeCase(key)),
      presenter: lodash.mapKeys(presenter, (_value, key) => lodash.snakeCase(key)),
      moderator: lodash.mapKeys(moderator, (_value, key) => lodash.snakeCase(key)),
      tabs: this.tabs
    }
    return JSON.parse(JSON.stringify(jsonData));
  }

  static fromDatabase(args: any){
    return new Configuration(args as IConfiguration);
  }
}
export default Configuration;