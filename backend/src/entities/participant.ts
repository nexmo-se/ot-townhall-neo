interface IParticipant {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
}

class Participant implements IParticipant{
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;

  constructor(args: IParticipant){
    this.firstName = args.firstName;
    this.lastName = args.lastName;
    this.email = args.email;
    this.companyName = args.companyName;
  }
}
export default Participant;