// @flow
export default {
  questionTab: (process.env.REACT_APP_DISPLAY_QUESTION_TAB || "true") === "true",
  chatTab: (process.env.REACT_APP_DISPLAY_CHAT_TAB || "true") === "true",
  participantTab: (process.env.REACT_APP_DISPLAY_PARTICIPANT_TAB || "true") === "true"
}