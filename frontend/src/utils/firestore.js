// @flow
import * as firebase from "firebase/app";
import "firebase/firestore";

import config from "config/firebase";

class Firestore{
  static instance:any;
  
  static init(){
    firebase.initializeApp({
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      projectId: config.projectID
    });
    Firestore.instance = firebase.firestore();
  }
  
  static getInstance(){
    if(!Firestore.instance) Firestore.init();
    return Firestore.instance;
  }
}
export default Firestore;