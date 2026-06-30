// @flow

type TArguments = any | void;
interface ICallback {
  error?: (err?: Error) => any;
  done?: (returnValue?: any) => any;
  finally?: () => any;
}

class FetchHelper{
  static async fetch(
    func: Function, 
    stateFunc: Function = () => {}, 
    args?: TArguments, 
    callback?: ICallback
  ){
    try{
      stateFunc(true);
      const returnValue = (args)? await func(args): await func();
      if(callback?.done) await callback.done(returnValue);
      return returnValue;
    }catch(err){
      if(callback?.error) await callback.error(err);
      console.log(err.stack);
    }finally{
      if(callback?.finally) await callback.finally();
      stateFunc(false)
    }
  }
}
export default FetchHelper;