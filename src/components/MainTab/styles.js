// @flow
import { makeStyles } from "@material-ui/styles";
export default makeStyles(() => ({
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