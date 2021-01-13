// @flow
const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY ?? "",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ?? "",
  projectID: process.env.REACT_APP_FIREBASE_PROJECT_ID ?? ""
}

export default config;
