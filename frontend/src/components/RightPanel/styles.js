// @flow
import { makeStyles } from "@material-ui/styles";
export default makeStyles(() => ({
  root: {
    flexBasis: "25%",
    overflow: "hidden",
    borderLeft: "1px solid #e7ebee",
    display: "flex", 
    flexDirection: "column"
  },
  moderator: {
    flexBasis: "25%",
    overflow: "hidden",
    borderBottom: "1px solid #e7ebee", 
    position: "relative"
  }
}), { index: 1 })