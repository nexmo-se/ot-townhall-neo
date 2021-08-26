import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import config from "config/firebase";

class Firestore {
  static instance;
  
  static init () {
    const app = initializeApp({
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      projectId: config.projectID
    });
    Firestore.instance = getFirestore(app);
  }
  
  static getInstance () {
    if (!Firestore.instance) Firestore.init();
    return Firestore.instance;
  }
}

export default Firestore;