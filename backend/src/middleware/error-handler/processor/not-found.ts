import Response from "../response";
import { Processor } from "./index";

class NotFoundError implements Processor{
  error: Error;

  constructor(error: Error){
    this.error = error;
  }

  prepareResponse():Response{
    const response = new Response({ 
      status: 404,
      message: "Not found",
      stack: this.error.stack
    });
    return response;
  }
}
export default NotFoundError;