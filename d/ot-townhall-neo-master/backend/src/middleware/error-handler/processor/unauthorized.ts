import Response from "../response";
import { Processor } from "./index";

class Unauthorized implements Processor{
  error: Error;

  constructor(error: Error){
    this.error = error;
  }

  prepareResponse(): Response{
    const response = new Response({ 
      status: 401,
      message: "Unauthorized",
      stack: this.error.stack
    });
    return response;
  }
}
export default Unauthorized;