// @flow
import { makeStyles } from "@material-ui/core/styles";
export default makeStyles((theme) => ({
  container: {
    display: "flex"
  },
  title: {
    marginBottom: 0
  },
  left: {
    flex: 1
  },
  right: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row"
  },
  time: {
    marginRight: theme.spacing(2),
    marginBottom: 0
  },
  noMarginRight: {
    marginRight: 0
  }
}), { index: 1 });