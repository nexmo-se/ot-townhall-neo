// @flow
import { makeStyles } from "@material-ui/core/styles";
export default makeStyles((theme) => ({
  tabs: {
    display: "flex",
    marginTop: theme.spacing(1),
    "& div": {
      flexBasis: "50%"
    }
  }
}), { index: 1 })