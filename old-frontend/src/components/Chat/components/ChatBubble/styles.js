// @flow
import { makeStyles } from "@material-ui/styles";
export default makeStyles(() => ({
  root: {
    marginTop: 8, 
    marginBottom: 4
  },
  avatar: { marginRight: 16 },
  chat: {
    display: "flex", 
    flexDirection: "column", 
    maxWidth: 200
  },
  message: {
    wordBreak: "break-word", 
    whiteSpace: "normal"
  }
}), { index: 1 })