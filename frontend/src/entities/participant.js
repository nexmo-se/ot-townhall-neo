// @flow
class Participant{
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;

  constructor(args: any){
    this.firstName = args.firstName;
    this.lastName = args.lastName;
    this.email = args.email;
    this.companyName = args.companyName;
  }

  toRequest(){
    const jsonData = {
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      company_name: this.companyName
    }
    return JSON.parse(JSON.stringify(jsonData));
  }
}
export default Participant;