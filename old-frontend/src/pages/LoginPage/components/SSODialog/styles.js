// @flow
import { makeStyles } from "@material-ui/styles";
export default makeStyles(() => ({
  container: {
    width: "100%", 
    height: "100%", 
    display: "flex",
    alignItems: "center", 
    justifyContent: "center"
  },
  card: { maxWidth: 500 },
  footer: {
    marginLeft: 0,
    marginRight: 0
  }
}), { index: 1 })