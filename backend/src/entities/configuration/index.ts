import MongoDBService from "../../utils/mongodb";
import lodash from "lodash";
import { Document, Filter, UpdateFilter, UpdateOptions } from "mongodb";
import { AcceptedRole, Role, State, Tabs } from "./types";

interface Constructor {
  tabs: Tabs;
  participant: Role;
  presenter: Role;
  moderator: Role;
  state: State;
}

class Configuration {
  static _collectionName = "configurations";

  tabs: Tabs;
  participant: Role;
  presenter: Role;
  moderator: Role;
  state: State;

  constructor (args: Constructor) {
    this.tabs = args.tabs;
    this.participant = args.participant;
    this.presenter = args.presenter;
    this.moderator = args.moderator;
    this.state = args.state;
  }

  retrievePin (role: AcceptedRole): string {
    if (role === "participant") return this.participant.pin;
    else if (role === "presenter") return this.presenter.pin;
    else if (role === "moderator") return this.moderator.pin;
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
    const toSnakeCase = (_value: string | boolean, key: string) => lodash(key).snakeCase();

    const jsonData = {
      participant: lodash.mapKeys(participant, toSnakeCase),
      presenter: lodash.mapKeys(presenter, toSnakeCase),
      moderator: lodash.mapKeys(moderator, toSnakeCase),
      tabs: lodash.mapKeys(this.tabs, toSnakeCase),
      state: lodash.mapKeys(this.state, toSnakeCase)
    };

    return lodash(jsonData).omitBy(lodash.isNil).value();
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
      },
      state: {
        status: args.configuration.state?.status ?? "locked" // default configuration for the status
      }
    })
  }

  static async updateOne (filter: Filter<Document>, update: UpdateFilter<Document>, options?: UpdateOptions) {
    const db = await MongoDBService.getInstance();
    await db.collection(Configuration._collectionName).updateOne(filter, update, options);
  }
}
export default Configuration;