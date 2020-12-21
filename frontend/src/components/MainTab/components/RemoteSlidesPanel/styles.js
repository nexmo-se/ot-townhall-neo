// @flow
import { makeStyles } from "@material-ui/core/styles";
export default makeStyles(() => ({
  root: { 
    position: "relative",
    flex: 1
  },
  topCover: {
    height: 60,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FAFAFA"
  },
  bottomCover: {
    height: 80,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FAFAFA"
  }
}), { index: 1 })