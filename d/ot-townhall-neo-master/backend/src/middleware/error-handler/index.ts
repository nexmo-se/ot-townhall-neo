import { Request, Response } from "express";

import NotUniqueProcessor from "./processor/not-unique";
import NotFoundProcessor from "./processor/not-found";
import UnknownProcessor from "./processor/unknown";
import UnauthorizedProcessor from "./processor/unauthorized";
import { Processor } from "./processor";

class ErrorHandler{
  static buildProcessor(err: Error): Processor{
    if(err.name === "SequelizeUniqueConstraintError") return new NotUniqueProcessor(err);
    else if(err.name === "NotFound") return new NotFoundProcessor(err);
    else if(err.name === "Unauthorized") return new UnauthorizedProcessor(err);
    else return new UnknownProcessor(err);
  }

  // eslint-disable-next-line 
  static handle(err: Error, req: Request, res: Response, next: () => void): void{
    const processor = ErrorHandler.buildProcessor(err);
    const response = processor.prepareResponse();
    return res.status(response.status).json(response.toJSON()).end();
  }
}
export default ErrorHandler;