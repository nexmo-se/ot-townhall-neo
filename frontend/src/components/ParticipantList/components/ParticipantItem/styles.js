// @flow
import { makeStyles } from "@material-ui/styles";
export default makeStyles(() => ({
  root: {
    marginTop: 8,
    marginBottom: 4
  },
  content: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  nameContent: {
    display: "flex",
    flexDirection: "column",
    maxWidth: 200
  },
  avatar: { marginRight: 16 }
}), { index: 1 })