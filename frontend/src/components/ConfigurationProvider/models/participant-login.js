import Login from "./login";

class ParticipantLogin extends Login {
  constructor (args) {
    super(args);
    this.raiseHand = args.raiseHand;
  }
}

export default ParticipantLogin;
