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
  card: { maxWidth: "40%" },
  icon: {
    width: 64,
    height: 64,
    marginBottom: 24
  },
  footer: {
    marginLeft: 0,
    marginRight: 0
  }
}), { index: 1 });