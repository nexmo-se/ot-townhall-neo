import Response from "../response";
import { Processor } from "./index";

class NotUniqueProcessor implements Processor{
  error: Error;

  constructor(error: Error){
    this.error = error;
  }

  prepareResponse(): Response{
    const response = new Response({ 
      status: 409,
      message: "Duplicate entry",
      stack: this.error.stack
    });
    return response;
  }
}
export default NotUniqueProcessor;