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
  static _collectionName = "configurations";

  tabs: ITabs;
  participant: IRole;
  presenter: IRole;
  moderator: IRole;

  constructor(args: IConfiguration){
    Object.assign(this, args);
  }

  retrievePin(role: TRole): string{
    if (role === "participant") return this.participant.pin;
    else if(role === "presenter") return this.presenter.pin;
    else if(role === "moderator") return this.moderator.pin;
    else throw new Error("Invalid role");
  }

  toResponse(): any{
    const roleModel = { loginType: true };
    const participant = lodash.pick(this.participant, lodash.keys(roleModel));
    const presenter = lodash.pick(this.presenter, lodash.keys(roleModel));
    const moderator = lodash.pick(this.moderator, lodash.keys(roleModel));

    const jsonData = {
      participant: lodash.mapKeys(participant, (_value, key) => lodash.snakeCase(key)),
      presenter: lodash.mapKeys(presenter, (_value, key) => lodash.snakeCase(key)),
      moderator: lodash.mapKeys(moderator, (_value, key) => lodash.snakeCase(key)),
      tabs: this.tabs
    };
    return JSON.parse(JSON.stringify(jsonData));
  }

  // Ignoring because MongoDB return any as the result
  // eslint-disable-next-line
  static fromDatabase(args: any): Configuration{
    return new Configuration({
      tabs: {
        questions: args.configuration.tabs.questions,
        chat: args.configuration.tabs.chat,
        participants: args.configuration.tabs.participants,
        polling: args.configuration.tabs.polling
      },
      presenter: {
        loginType: args.configuration.presenter.login_type,
        pin: args.configuration.presenter.pin
      },
      participant: {
        loginType: args.configuration.participant.login_type,
        pin: args.configuration.participant.pin
      },
      moderator: {
        loginType: args.configuration.moderator.login_type,
        pin: args.configuration.moderator.pin
      }
    })
  }
}
export default Configuration;