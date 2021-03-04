// @flow

export type TRole = "participant" | "moderator" | "presenter";
interface IRole {
  loginType: "default" | "ama" | "sso";
}

interface ITabs {
  questions: boolean;
  participants: boolean;
  polling: boolean;
  chat: boolean;
}

interface Constructor {
  tabs: ITabs;
  participant: IRole;
  presenter: IRole;
  moderator: IRole;
}

class Configuration {
  tabs: ITabs;
  participant: IRole;
  presenter: IRole;
  moderator: IRole;

  constructor (args: Constructor) {
    this.tabs = args.tabs;
    this.participant = args.participant;
    this.presenter = args.presenter;
    this.moderator = args.moderator;
  }

  static fromResponse (response: any) {
    return new Configuration({
      tabs: {
        questions: response.tabs.questions,
        participants: response.tabs.participants,
        polling: response.tabs.polling,
        chat: response.tabs.chat
      },
      participant: {
        loginType: response.participant.login_type
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