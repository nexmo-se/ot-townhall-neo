class CustomError extends Error{
  name: string;
  message: string;
  code: string;
  
  constructor(name: string, message: string){
    super();
    this.name = name;
    this.code = name;
    this.message = message;
  }
}

export default CustomError;