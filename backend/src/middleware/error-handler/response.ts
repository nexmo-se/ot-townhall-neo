class Response{
  status: number;
  message: string;
  stack: any;

  constructor(args: any){
    this.status = 200;
    this.message = "";
    this.stack = undefined;

    if(args) Object.assign(this, args);
  }

  toJSON(){
    const jsonData = {
      status: this.status,
      message: this.message,
      stack: this.stack
    }
    return jsonData;
  }
}
export default Response;