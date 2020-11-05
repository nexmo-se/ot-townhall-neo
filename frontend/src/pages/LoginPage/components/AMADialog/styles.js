// @flow
import { makeStyles } from "@material-ui/styles";
export default makeStyles(() => ({
  root: {
    width: "100%", 
    height: "100%", 
    display: "flex",
    alignItems: "center", 
    justifyContent: "center",
    position: "relative"
  },
  card: { 
    maxWidth: "70%",
    display: "flex",
    position: "relative"
  },
  icon: {
    width: 64,
    height: 64,
    marginBottom: 24
  },
  left: {
    borderRightWidth: 1,
    borderRightStyle: "solid",
    borderRightColor: "#c2c4cc",
    width: "50%",
    paddingRight: 32,
    marginRight: 32
  },
  right: {},
  footer: {
    marginLeft: 0,
    marginRight: 0
  }
}), { index: 1 });