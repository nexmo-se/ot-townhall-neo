// @flow
const config = {
  roomName: process.env.REACT_APP_ROOM_NAME ?? "vonageTownhall",
  presenterPin: process.env.REACT_APP_PRESENTER_PIN ?? "3345",
  moderatorPin: process.env.REACT_APP_MODERATOR_PIN ?? "5523",
  apiURL : process.env.REACT_APP_API_URL ?? "http://localhost",
  loginStyle: process.env.REACT_APP_LOGIN_STYLE ?? "default"
}

export default config;
