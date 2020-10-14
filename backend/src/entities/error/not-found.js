// @flow
class NotFoundError extends Error{
  constructor(){
    super();
    this.name = "NotFound";
  }
}
export default NotFoundError;