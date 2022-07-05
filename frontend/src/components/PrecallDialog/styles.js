import { makeStyles } from "@material-ui/core";

export default makeStyles(
  (theme) => ({
    marginRight: {
      marginRight: theme.spacing(2)
    },
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "70%"
    },
    wrapper: {
      display: "flex",
      justifyContent: "center"
    },
    item: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
    subItem: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center"
    }
  }),
  { index: 1 }
)