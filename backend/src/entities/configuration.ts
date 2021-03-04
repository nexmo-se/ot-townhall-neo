import lodash from "lodash";
import { FilterQuery, UpdateOneOptions, UpdateQuery } from "mongodb";
import MongoDBService from "../utils/mongodb";

export type AcceptedRole = "participant" | "moderator" | "presenter";
interface Role {
  loginType: "default" | "ama" | "sso";
  pin: string;
  raiseHand?: boolean;
}

interface Tabs {
  questions: boolean;
  participants: boolean;
  polling: boolean;
  chat: boolean;
}

interface Constructor {
  tabs: Tabs;
  participant: Role;
  presenter: Role;
  moderator: Role;
}

class Configuration {
  static _collectionName = "configurations";

  tabs: Tabs;
  participant: Role;
  presenter: Role;
  moderator: Role;

  constructor (args: Constructor) {
    this.tabs = args.tabs;
    this.participant = args.participant;
    this.presenter = args.presenter;
    this.moderator = args.moderator;
  }

  retrievePin (role: AcceptedRole): string {
    if (role === "participant") return this.participant.pin;
    else if(role === "presenter") return this.presenter.pin;
    else if(role === "moderator") return this.moderator.pin;
    else throw new Error("Invalid role");
  }

  toResponse (): Record<string, any> {
    const roleModel = {
      loginType: true,
      raiseHand: true
    };

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

  static fromDatabase (args: Record<string, any>): Configuration {
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
        pin: args.configuration.participant.pin,
        raiseHand: args.configuration.participant.raise_hand ?? true
      },
      moderator: {
        loginType: args.configuration.moderator.login_type,
        pin: args.configuration.moderator.pin
      }
    })
  }

  static async updateOne (filter: FilterQuery<any>, update: UpdateQuery<any>, options?: UpdateOneOptions) {
    const db = await MongoDBService.getInstance();
    await db.collection(Configuration._collectionName).updateOne(filter, update, options);
  }
}
export default Configuration;