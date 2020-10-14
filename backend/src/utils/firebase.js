// @flow
import serviceAccount from "serviceAccount.json";
import admin from "firebase-admin";

class Firebase{
  static init(){
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://vonage-townhall.firebaseio.com"
    });
  }
}
export default Firebase;