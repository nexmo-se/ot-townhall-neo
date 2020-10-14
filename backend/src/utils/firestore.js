// @flow
import admin from "firebase-admin";

class Firestore{
  static instance:any ;
  
  static init(){
    Firestore.instance = admin.firestore();
  }
  
  static getInstance(){
    if(!Firestore.instance) Firestore.init();
    return Firestore.instance;
  }
}
export default Firestore;