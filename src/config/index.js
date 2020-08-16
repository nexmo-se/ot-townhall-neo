// @flow
export default {
  roomName: process.env.REACT_APP_ROOM_NAME ?? "vonageTownhall",
  presenterPin: process.env.REACT_APP_PRESENTER_PIN ?? "3345",
  moderatorPin: process.env.REACT_APP_MODERATOR_PIN ?? "5523",
  participantPin: process.env.REACT_APP_PARTICIPANT_PIN ?? "1123",
  apiURL : process.env.REACT_APP_API_URL ?? "http://localhost"
}