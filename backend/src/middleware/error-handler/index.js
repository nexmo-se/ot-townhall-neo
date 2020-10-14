// @flow
import NotUniqueProcessor from "./processor/not-unique";
import NotFoundProcessor from "./processor/not-found";
import UnknownProcessor from "./processor/unknown";
import UnauthorizedProcessor from "./processor/unauthorized";
import { Processor } from "./processor";

class ErrorHandler{
  static buildProcessor(err:Error):Processor{
    if(err.name === "SequelizeUniqueConstraintError") return new NotUniqueProcessor(err)
    else if(err.name === "NotFound") return new NotFoundProcessor(err);
    else if(err.name === "Unauthorized") return new UnauthorizedProcessor(err);
    else return new UnknownProcessor(err);
  }

  static handle(err:Error, req:any, res:any, next:any){
    const processor = ErrorHandler.buildProcessor(err);
    const response = processor.prepareResponse()
    return res.status(response.status).json(response.toJSON()).end();
  }
}
export default ErrorHandler