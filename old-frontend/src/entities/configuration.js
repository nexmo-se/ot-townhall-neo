// @flow

export type AcceptedRole = "participant" | "moderator" | "presenter";
type Role = {
  loginType: "default" | "ama" | "sso";
  raiseHand?: boolean;
}

type State = {
  status: "open" | "locked";
}

type LobbySource = {
  link: string;
}

type Tabs = {
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
  tabs: Tabs;
  participant: Role;
  presenter: Role;
  moderator: Role;
  state: State;
  LobbySource: LobbySource

  constructor (args: Constructor) {
    this.tabs = args.tabs;
    this.participant = args.participant;
    this.presenter = args.presenter;
    this.moderator = args.moderator;
    this.state = args.state;
    this.lobbySource = args.lobbySource;
  }

  static fromResponse (response: any): Configuration {
    return new Configuration({
      tabs: {
        questions: response.tabs.questions,
        participants: response.tabs.participants,
        polling: response.tabs.polling,
        chat: response.tabs.chat
      },
      participant: {
        loginType: response.participant.login_type,
        raiseHand: response.participant.raise_hand ?? true
      },
      moderator: {
        loginType: response.moderator.login_type
      },
      presenter: {
        loginType: response.presenter.login_type
      },
      lobbySource: {
        link: response.lobbySource.link
      },
      state: {
        status: response.state.status
      }
    })
  }

}
export default Configuration;