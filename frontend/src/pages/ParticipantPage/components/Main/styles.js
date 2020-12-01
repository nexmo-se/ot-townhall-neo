// @flow
import { makeStyles } from "@material-ui/styles";
export default makeStyles(() => ({
  container: { 
    width: "100%", 
    flex: 1,
    overflow: "hidden",
    display: "flex", 
    flexDirection: "row" 
  },
  leftContainer: { 
    flexBasis: "75%",
    overflow: "hidden",
    flexDirection: "column",
    display: "flex",
    position: "relative" 
  },
  black: { backgroundColor: "black" }, 
  logoContainer: { 
    display: "flex", 
    flexDirection: "column", 
    position: "absolute", 
    top: 32, 
    right: 32, 
    zIndex: 2, 
    justifyContent: "center", 
    alignItems: "flex-end"
  },
  vonageLogo: {
    position: "absolute",
    bottom: 32,
    right: 32,
    zIndex: 2
  }
}))