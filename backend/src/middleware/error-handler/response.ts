interface IResponse {
  status: number;
  message: string;
  stack: any;
}

class Response implements IResponse{
  status: number;
  message: string;
  stack: any;

  constructor(args: IResponse){
    this.status = 200;
    this.message = "";
    this.stack = undefined;

    if(args) Object.assign(this, args);
  }

  toJSON(): Record<string, any>{
    const jsonData = {
      status: this.status,
      message: this.message,
      stack: this.stack
    };
    return jsonData;
  }
}
export default Response;