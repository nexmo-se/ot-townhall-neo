// @flow

export type AcceptedRole = "participant" | "moderator" | "presenter";
type Role = {
  loginType: "default" | "ama" | "sso";
  raiseHand?: boolean;
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

  constructor (args: Constructor) {
    this.tabs = args.tabs;
    this.participant = args.participant;
    this.presenter = args.presenter;
    this.moderator = args.moderator;
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
      }
    })
  }

}
export default Configuration;