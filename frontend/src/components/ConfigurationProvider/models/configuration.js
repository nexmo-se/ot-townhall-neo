import Tabs from "./tabs";
import Login from "./login";
import ParticipantLogin from "./participant-login";
import State from "./state";

class Configuration {

  constructor (args) {
    this.tabs = args.tabs;
    this.participant = args.participant;
    this.presenter = args.presenter;
    this.moderator = args.moderator;
    this.state = args.state;
  }

  static fromResponse (response) {
    return new Configuration({
      tabs: new Tabs({
        questions: response.tabs.questions,
        participants: response.tabs.participants,
        polling: response.tabs.polling,
        chat: response.tabs.chat
      }),
      participant: new ParticipantLogin({
        loginType: response.participant.login_type,
        raiseHand: response.participant.raise_hand ?? true
      }),
      moderator: new Login({ loginType: response.moderator.login_type }),
      presenter: new Login({ loginType: response.presenter.login_type }),
      state: new State({ status: response.state?.status ?? "locked" }) // Default configuration if the room doesn't have status
    })
  }

}
export default Configuration;