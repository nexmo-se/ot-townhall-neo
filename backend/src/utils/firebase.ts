import serviceAccount from "./serviceAccount";
import admin from "firebase-admin";

class Firebase{
  static init(): void{
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://vonage-townhall.firebaseio.com"
    });
  }
}
export default Firebase;