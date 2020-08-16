// @flow
class Question{
  owner: User,
  content: string,
  vote: number
  
  constructor(args:any){
    this.owner = args?.owner;
    this.content = args.content;
    this.vote = args.vote;
  }
}
export default Question;