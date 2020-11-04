import admin from "firebase-admin";

class Firestore{
  static instance: admin.firestore.Firestore;
  
  static init(): void{
    Firestore.instance = admin.firestore();
  }
  
  static getInstance(): admin.firestore.Firestore{
    if(!Firestore.instance) Firestore.init();
    return Firestore.instance;
  }
}
export default Firestore;