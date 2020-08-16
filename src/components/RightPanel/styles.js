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
  tabs: {
    flex: 3, 
    display: "flex", 
    flexDirection: "column", 
    padding: 16, 
    overflowY: "hidden"
  },
  contentContainer: {
    display: "flex",
    flex: 1,
    overflow: "hidden"
  },
  tabContent: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    marginTop: 0
  }
}), { index: 1 })