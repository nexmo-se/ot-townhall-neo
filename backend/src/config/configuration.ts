import PinConfiguration from "./pin";

const config = {
  default: {
    presenter: {
      login_type: "sso",
      pin: PinConfiguration.presenter
    },
    participant: {
      login_type: "sso",
      pin: PinConfiguration.participant,
      raise_hand: true
    },
    moderator: {
      login_type: "sso",
      pin: PinConfiguration.moderator
    },
    tabs: {
      questions: true,
      chat: true,
      participants: true,
      polling: true
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
    }
  }
}

export default config;
