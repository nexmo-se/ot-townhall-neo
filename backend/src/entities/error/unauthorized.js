// @flow
class UnauthorizedError extends Error{
  constructor(){
    super();
    this.name = "Unauthorized";
  }
}
export default UnauthorizedError;