import PinConfiguration from "./pin";
import LobbyConfiguration from "./lobby";

const config = {
  default: {
    presenter: {
      login_type: "default",
      pin: PinConfiguration.presenter
    },
    participant: {
      login_type: "default",
      pin: PinConfiguration.participant,
      raise_hand: true
    },
    moderator: {
      login_type: "default",
      pin: PinConfiguration.moderator
    },
    tabs: {
      questions: true,
      chat: true,
      participants: true,
      polling: true
    },
    lobbySource: {
      link: LobbyConfiguration.lobbySource
    },
    state: {
      status: "locked"
    }
  },
  vidsDefault: {
    presenter: {
      login_type: "default",
      pin: PinConfiguration.presenter
    },
    participant: {
      login_type: "default",
      pin: PinConfiguration.participant,
      raise_hand: true
    },
    moderator: {
      login_type: "default",
      pin: PinConfiguration.moderator
    },
    tabs: {
      questions: true,
      chat: true,
      participants: true,
      polling: true
    },
    lobbySource: {
      link: LobbyConfiguration.lobbySource
    },
    state: {
      status: "locked"
    }
  }
}

export default config;
