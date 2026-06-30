// @flow
import { makeStyles } from "@material-ui/styles";
export default makeStyles(() => ({
  guideContainer: {
    display: "flex",
    backgroundColor: "rgba(0, 0, 0, .7)",
    zIndex: 1,
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center"
  },
  guideContent: {
    display: "flex",
    maxWidth: "70%",
    overflow: "scroll"
  },
  guideImage: {
    width: "50%",
    marginRight: 32
  },
  guideHidden: { display: "none !important" },

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