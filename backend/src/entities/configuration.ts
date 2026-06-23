import lodash from "lodash";
import PinConfiguration from "../config/pin";
import LobbyConfiguration from "../config/lobby";

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

interface State {
  status: "open" | "locked"
}

interface LobbySource {
  link: string
}

interface Constructor {
  tabs: Tabs;
  participant: Role;
  presenter: Role;
  moderator: Role;
  state: State;
  lobbySource: LobbySource;
}

class Configuration {
  static _collectionName = "configurations";

  tabs: Tabs;
  participant: Role;
  presenter: Role;
  moderator: Role;
  state: State;
  lobbySource: LobbySource;

  constructor (args: Constructor) {
    this.tabs = args.tabs;
    this.participant = args.participant;
    this.presenter = args.presenter;
    this.moderator = args.moderator;
    this.state = args.state;
    this.lobbySource = args.lobbySource;
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
      tabs: this.tabs,
      state: this.state,
      lobbySource: this.lobbySource
    };
    return JSON.parse(JSON.stringify(jsonData));
  }

  static fromDatabase (args: Record<string, any>): Configuration {
    const configuration = args?.configuration ?? {};

    return new Configuration({
      tabs: {
        questions: configuration.tabs?.questions ?? true,
        chat: configuration.tabs?.chat ?? true,
        participants: configuration.tabs?.participants ?? true,
        polling: configuration.tabs?.polling ?? true
      },
      presenter: {
        loginType: configuration.presenter?.login_type ?? "default",
        pin: configuration.presenter?.pin ?? PinConfiguration.presenter
      },
      participant: {
        loginType: configuration.participant?.login_type ?? "default",
        pin: configuration.participant?.pin ?? PinConfiguration.participant,
        raiseHand: configuration.participant?.raise_hand ?? true
      },
      moderator: {
        loginType: configuration.moderator?.login_type ?? "default",
        pin: configuration.moderator?.pin ?? PinConfiguration.moderator
      },
      lobbySource: {
        link: configuration.lobbySource?.link ?? LobbyConfiguration.lobbySource
      },
      state: {
        status: configuration.state?.status ?? "locked"
      }
    })
  }
}
export default Configuration;