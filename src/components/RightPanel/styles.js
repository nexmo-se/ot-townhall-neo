// @flow
import { makeStyles } from "@material-ui/styles";
export default makeStyles(() => ({
  root: {
    flex: 1, 
    borderLeft: "1px solid #e7ebee",
    display: "flex", 
    flexDirection: "column"
  },
  moderator: {
    flex: 1, 
    borderBottom: "1px solid #e7ebee", 
    position: "relative"
  },
  otherFunctions: {
    flex: 3, 
    display: "flex", 
    flexDirection: "column", 
    padding: 16, 
    overflowY: "scroll"
  }
}), { index: 1 })