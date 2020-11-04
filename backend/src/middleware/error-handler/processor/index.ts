import Response from "../response";

export interface Processor{
  error: Error;
  prepareResponse(): Response;
}