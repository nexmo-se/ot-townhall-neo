// @flow
import { makeStyles } from "@material-ui/styles";
export default makeStyles(() => ({
  container: { 
    width: "100%", 
    overflow: "hidden",
    flex: 1,
    display: "flex", 
    flexDirection: "row" 
  },
  leftPanel: { 
    flexBasis: "25%",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    padding: 32,
    paddingLeft: 0,
    paddingRight: 0
  },
  chat: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "scroll"
  },
  centerPanel: { 
    flexBasis: "25%",
    overflow: "hidden",
    borderLeft: "1px solid #e7ebee", 
    borderRight: "1px solid #e7ebee",
    display: "flex", 
    flexDirection: "column", 
    padding: 32,
    paddingLeft: 0,
    paddingRight: 0
  },
  rightPanel: { 
    flexBasis: "50%",
    overflow: "hidden",
    position: "relative",
    display: "flex", 
    flexDirection: "column"
  },
  black: { backgroundColor: "black" },
  
  visible: { display: "inherit" },
  hidden: { display: "none !important" },
  liveBadge: {
    alignSelf: "flex-end",
    position: "absolute",
    top: 32,
    right: 32
  }
}))