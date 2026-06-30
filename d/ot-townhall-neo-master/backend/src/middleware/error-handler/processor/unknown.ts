import Response from "../response";
import { Processor } from "./index";

class Unknown implements Processor{
  error: Error;

  constructor(error: Error){
    this.error = error;
  }

  prepareResponse(): Response{
    const response = new Response({ 
      status: 500,
      message: "Unknown error",
      stack: this.error.stack || this.error
    });
    return response;
  }
}
export default Unknown;