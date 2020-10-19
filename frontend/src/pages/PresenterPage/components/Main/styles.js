// @flow
import { makeStyles } from "@material-ui/styles";
export default makeStyles(() => ({
  container: { 
    width: "100vw", 
    height: "100vh", 
    display: "flex", 
    flexDirection: "row" 
  },
  leftContainer: { 
    flex: 3, 
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